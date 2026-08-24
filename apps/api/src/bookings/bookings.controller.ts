import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TenantGuard } from '../auth/tenant.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@mealflow/types';

@Controller('properties/:propertyId/bookings')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.RESIDENT)
  @Post()
  create(
    @Param('propertyId') propertyId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    if (createBookingDto.propertyId !== propertyId) {
      throw new ForbiddenException('Property ID mismatch');
    }
    return this.bookingsService.create(createBookingDto);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.KITCHEN_STAFF, UserRole.RESIDENT)
  @Get()
  findAll(@Param('propertyId') propertyId: string) {
    return this.bookingsService.findAll(propertyId);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.RESIDENT)
  @Get(':id')
  findOne(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
  ) {
    return this.bookingsService.findOne(id, propertyId);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.RESIDENT)
  @Patch(':id')
  update(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    if (updateBookingDto.propertyId && updateBookingDto.propertyId !== propertyId) {
       throw new ForbiddenException('Cannot change property ID');
    }
    return this.bookingsService.update(id, propertyId, updateBookingDto);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.RESIDENT)
  @Delete(':id')
  remove(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
  ) {
    return this.bookingsService.remove(id, propertyId);
  }
}
