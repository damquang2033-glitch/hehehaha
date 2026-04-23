import { IsOptional, IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  recipientId!: string; // hostId or guestId

  @IsString()
  @MinLength(1)
  content!: string;

  @IsString()
  @IsOptional()
  listingId?: string;
}
