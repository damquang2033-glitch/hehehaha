import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/modules/auth/auth.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.sub, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyReviews(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findMyReviews(
      user.sub,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }
}

@Controller('listings/:listingId/reviews')
export class ListingReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getListingReviews(
    @Param('listingId') listingId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findByListing(
      listingId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }
}
