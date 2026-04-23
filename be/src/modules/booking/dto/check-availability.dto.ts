import { IsDateString, IsString } from 'class-validator';

export class CheckAvailabilityDto {
  @IsString()
  listingId!: string;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;
}
