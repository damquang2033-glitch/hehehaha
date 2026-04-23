import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(guestId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      select: { guestId: true, listingId: true, status: true },
    });

    if (!booking) throw new NotFoundException('Booking không tồn tại');
    if (booking.guestId !== guestId)
      throw new ForbiddenException('Không có quyền review booking này');
    if (booking.status !== BookingStatus.CHECKED_OUT)
      throw new BadRequestException(
        'Chỉ được review sau khi khách đã check-out',
      );

    const existing = await this.prisma.review.findUnique({
      where: { bookingId: dto.bookingId },
    });
    if (existing) throw new ConflictException('Bạn đã review booking này rồi');

    return this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        guestId,
        listingId: booking.listingId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        guest: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async findByListing(listingId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { listingId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          guest: { select: { id: true, name: true, avatar: true } },
        },
      }),
      this.prisma.review.count({ where: { listingId } }),
    ]);

    const avgRating =
      total > 0
        ? await this.prisma.review
            .aggregate({ where: { listingId }, _avg: { rating: true } })
            .then((r) => Math.round((r._avg.rating ?? 0) * 10) / 10)
        : 0;

    return { data, total, page, limit, avgRating };
  }

  async findMyReviews(guestId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { guestId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: { select: { id: true, title: true, images: true } },
        },
      }),
      this.prisma.review.count({ where: { guestId } }),
    ]);

    return { data, total, page, limit };
  }
}
