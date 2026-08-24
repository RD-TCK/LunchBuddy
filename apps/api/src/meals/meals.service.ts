import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MealStatus } from '@mealflow/types';
import { randomUUID } from 'crypto';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate Meal records from all BOOKED bookings for a menu.
   * This is the core "Meal Engine" that converts bookings → trackable meals.
   */
  async generateFromMenu(menuId: string, propertyId: string, userId: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId, propertyId },
      include: {
        bookings: {
          where: { status: 'BOOKED' },
          include: { resident: true },
        },
      },
    });

    if (!menu) throw new NotFoundException('Menu not found');

    const bookedBookings = menu.bookings;
    if (bookedBookings.length === 0) {
      return { generated: 0, message: 'No BOOKED bookings found for this menu' };
    }

    // Skip bookings that already have a Meal
    const existingMeals = await this.prisma.meal.findMany({
      where: {
        bookingId: { in: bookedBookings.map((b) => b.id) },
      },
      select: { bookingId: true },
    });
    const existingBookingIds = new Set(existingMeals.map((m) => m.bookingId));

    const newBookings = bookedBookings.filter(
      (b) => !existingBookingIds.has(b.id),
    );

    if (newBookings.length === 0) {
      return { generated: 0, message: 'All bookings already have meals generated' };
    }

    // Create Meal records with unique QR tokens
    const meals = await this.prisma.$transaction(
      newBookings.map((booking) =>
        this.prisma.meal.create({
          data: {
            propertyId,
            bookingId: booking.id,
            residentId: booking.residentId,
            roomId: booking.resident.roomId,
            status: MealStatus.BOOKED,
            qrToken: randomUUID(),
          },
        }),
      ),
    );

    // Log events
    await this.prisma.mealEvent.createMany({
      data: meals.map((meal) => ({
        mealId: meal.id,
        status: MealStatus.BOOKED,
        userId,
      })),
    });

    return { generated: meals.length, mealIds: meals.map((m) => m.id) };
  }

  findAll(propertyId: string) {
    return this.prisma.meal.findMany({
      where: { propertyId },
      include: {
        booking: { include: { menu: true } },
        resident: { include: { user: { select: { name: true, email: true } } } },
        room: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, propertyId: string) {
    const meal = await this.prisma.meal.findUnique({
      where: { id, propertyId },
      include: {
        booking: { include: { menu: true } },
        resident: { include: { user: { select: { name: true, email: true } } } },
        room: true,
        events: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!meal) throw new NotFoundException('Meal not found');
    return meal;
  }

  async updateStatus(
    id: string,
    propertyId: string,
    status: MealStatus,
    userId: string,
  ) {
    const meal = await this.findOne(id, propertyId);

    const updatedMeal = await this.prisma.meal.update({
      where: { id: meal.id },
      data: { status },
    });

    await this.prisma.mealEvent.create({
      data: { mealId: id, status, userId },
    });

    return updatedMeal;
  }

  async remove(id: string, propertyId: string) {
    await this.findOne(id, propertyId);
    return this.prisma.meal.delete({ where: { id } });
  }
}
