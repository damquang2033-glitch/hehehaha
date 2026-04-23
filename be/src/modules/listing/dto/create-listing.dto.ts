import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[] = [];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  maxGuests?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  bedrooms?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  beds?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  bathrooms?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[] = [];

  @IsString()
  @IsOptional()
  propertyType?: string;

  @IsString()
  @IsOptional()
  rentalType?: string;

  @IsString()
  @IsOptional()
  structure?: string;

  // ── Booking config ──────────────────────────────────────────────────────

  @IsBoolean()
  @IsOptional()
  instantBooking?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  freeCancelBeforeHours?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  partialRefundPercent?: number;
}
