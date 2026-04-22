// src/modules/upload/upload.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import { GetMultiplePresignedUrlsDto } from './dto/get-multiple-presigned-urls.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard) // Chỉ user đã login mới được upload
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Xin 1 presigned URL
  @Post('presigned-url')
  async getPresignedUrl(@Body() dto: GetPresignedUrlDto) {
    return this.uploadService.generatePresignedUrl(
      dto.fileName,
      dto.fileType,
      dto.folder!,
    );
  }

  // Xin nhiều presigned URL cùng lúc (upload gallery)
  @Post('presigned-urls')
  async getMultiplePresignedUrls(@Body() dto: GetMultiplePresignedUrlsDto) {
    return this.uploadService.generateMultiplePresignedUrls(
      dto.files,
      dto.folder!,
    );
  }
}