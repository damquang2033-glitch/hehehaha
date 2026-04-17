import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ListingController],
  providers: [ListingService, RolesGuard],
})
export class ListingModule {}
