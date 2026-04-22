import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  ListingReviewsController,
  ReviewsController,
} from './reviews.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewsController, ListingReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
