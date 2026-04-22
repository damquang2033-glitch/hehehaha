import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { s3Client } from "src/config/aws.config";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UploadService {
    private readonly bucketName = process.env.AWS_BUCKET_NAME;
    private readonly region = process.env.AWS_REGION;

   /**
   * Tạo presigned URL cho FE tự upload lên S3
   * BE không nhận file — chỉ cấp "vé tạm thời"
   *
   * @param fileName - tên file gốc để lấy extension
   * @param fileType - mimetype (image/jpeg, image/png...)
   * @param folder   - thư mục trong S3 (rooms, hotels...)
   */
   async generatePresignedUrl(
    fileName: string,
    fileType: string,
    folder: string
   ): Promise<{ presignedUrl: string; key: string; publicUrl: string }> {
        const ext = fileName.split('.').pop();
        const key = `${folder}/${uuidv4()}.${ext}`; // tạo key duy nhất cho file tránh trùng tên

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: fileType,
        });

        // URL này có hiệu lực 10 phút
        // Sau 10 phút S3 từ chối request → bảo mật
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

        // URL public để hiển thị ảnh sau khi upload xong
        const publicUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

        return { presignedUrl, key, publicUrl };
    }

    /**
     * Tạo nhiều presigned URL cùng lúc
     * Dùng khi upload gallery phòng (5-10 ảnh)
     */
    async generateMultiplePresignedUrls(
        files: { fileName: string; fileType: string }[],
        folder: string = 'uploads',
    ) {
        return Promise.all(
        files.map((f) =>
            this.generatePresignedUrl(f.fileName, f.fileType, folder),
        ),
        );
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        });
        await s3Client.send(command);
    }
}