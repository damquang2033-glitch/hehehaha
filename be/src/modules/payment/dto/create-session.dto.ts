import { IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  bookingId!: string;
}
