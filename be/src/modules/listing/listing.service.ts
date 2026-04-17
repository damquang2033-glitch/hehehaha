import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingQueryDto } from './dto/listing-query.dto';

@Injectable()
export class ListingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListingQueryDto) {
    const { page = 1, limit = 10, location } = query;
    const skip = (page - 1) * limit;

    const where = location
      ? { location: { contains: location, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { host: { select: { id: true, name: true, avatar: true } } },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { host: { select: { id: true, name: true, avatar: true } } },
    });

    if (!listing) throw new NotFoundException('Listing not found');

    return listing;
  }

  async create(hostId: string, dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: { ...dto, hostId },
      include: { host: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async update(id: string, hostId: string, dto: UpdateListingDto) {
    await this.assertOwner(id, hostId);

    return this.prisma.listing.update({
      where: { id },
      data: dto,
      include: { host: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async remove(id: string, hostId: string) {
    await this.assertOwner(id, hostId);
    await this.prisma.listing.delete({ where: { id } });
  }

  private async assertOwner(id: string, hostId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      select: { hostId: true },
    });

    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.hostId !== hostId)
      throw new ForbiddenException('Access denied');
  }
}
