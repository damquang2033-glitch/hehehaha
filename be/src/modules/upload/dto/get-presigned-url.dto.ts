// src/modules/upload/dto/get-presigned-url.dto.ts
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class GetPresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string; // 'room1.jpg'

  @IsString()
  @IsIn(['image/jpeg', 'image/png', 'image/webp']) // chỉ cho phép ảnh
  fileType!: string;

  @IsString()
  @IsOptional()
  folder?: string; // không bắt buộc, default trong service
}