import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const existingBooking = await this.prisma.booking.findUnique({
      where: {
        menuId_residentId: {
          menuId: createBookingDto.menuId,
          residentId: createBookingDto.residentId,
        },
      },
    });

    if (existingBooking) {
      throw new ConflictException('Booking already exists for this menu and resident');
    }

    return this.prisma.booking.create({
      data: createBookingDto,
    });
  }

  findAll(propertyId: string) {
    return this.prisma.booking.findMany({
      where: { propertyId },
      include: {
          menu: true,
          resident: { include: { user: { select: { name: true, email: true } } } }
      }
    });
  }

  async findOne(id: string, propertyId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id, propertyId },
      include: {
          menu: true,
          resident: true
      }
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(id: string, propertyId: string, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id, propertyId);
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  async remove(id: string, propertyId: string) {
    await this.findOne(id, propertyId);
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
