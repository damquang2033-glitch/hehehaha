import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTO cho từng file trong mảng
class FileInfoDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  fileType!: string;
}

export class GetMultiplePresignedUrlsDto {
  @IsArray()
  @ValidateNested({ each: true }) // validate từng phần tử trong mảng
  @Type(() => FileInfoDto)        // class-transformer cần biết type để validate nested
  files!: FileInfoDto[];

  @IsString()
  @IsOptional()
  folder?: string;
}