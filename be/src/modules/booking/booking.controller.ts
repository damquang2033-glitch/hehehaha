import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // POST /bookings/availability — no auth needed conceptually, but keep under
  // the guard so FE always sends token (makes future rate-limiting easier)
  @Post('availability')
  checkAvailability(@Body() dto: CheckAvailabilityDto) {
    return this.bookingService.checkAvailability(dto);
  }

  // POST /bookings — Step 1: create HOLD
  @Post()
  hold(@CurrentUser() user: { id: string }, @Body() dto: CreateBookingDto) {
    return this.bookingService.hold(user.id, dto);
  }

  // POST /bookings/:id/pay — Step 2: get payment intent for HOLD
  @Post(':id/pay')
  initiatePayment(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.bookingService.initiatePayment(id, user.id);
  }

  // PATCH /bookings/:id/status — Manual status transitions (guest/host)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingService.updateStatus(id, user.id, dto);
  }

  // GET /bookings/me — guest's own bookings
  @Get('me')
  findMyBookings(
    @CurrentUser() user: { id: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingService.findMyBookings(
      user.id,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  // GET /bookings/host — host's incoming bookings
  @Get('host')
  findHostBookings(
    @CurrentUser() user: { id: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingService.findHostBookings(
      user.id,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  // GET /bookings/:id
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.bookingService.findOne(id, user.id);
  }
}
