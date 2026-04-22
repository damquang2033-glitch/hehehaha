import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import { GetMultiplePresignedUrlsDto } from './dto/get-multiple-presigned-urls.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url')
  async getPresignedUrl(@Body() dto: GetPresignedUrlDto) {
    return this.uploadService.generatePresignedUrl(
      dto.fileName,
      dto.fileType,
      dto.folder!,
    );
  }

  @Post('presigned-urls')
  async getMultiplePresignedUrls(@Body() dto: GetMultiplePresignedUrlsDto) {
    return this.uploadService.generateMultiplePresignedUrls(
      dto.files,
      dto.folder,
    );
  }
}