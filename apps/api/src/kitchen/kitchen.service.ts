import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MealStatus } from '@mealflow/types';

@Injectable()
export class KitchenService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get kitchen dashboard counts for a property on a given date.
   */
  async getDashboard(propertyId: string, date: string) {
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const meals = await this.prisma.meal.findMany({
      where: {
        propertyId,
        createdAt: {
          gte: targetDate,
          lt: nextDate,
        },
      },
      include: {
        resident: true,
        booking: { include: { menu: true } },
        room: true,
      },
    });

    const total = meals.length;
    const byStatus = meals.reduce(
      (acc, meal) => {
        acc[meal.status] = (acc[meal.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      date,
      total,
      byStatus,
      meals,
    };
  }

  /**
   * Mark meals as PREPARING (Kitchen starts cooking).
   */
  async startPreparing(propertyId: string, mealIds: string[], userId: string) {
    await this.prisma.meal.updateMany({
      where: {
        id: { in: mealIds },
        propertyId,
        status: MealStatus.BOOKED,
      },
      data: { status: MealStatus.PREPARING },
    });

    // Log events
    await this.prisma.mealEvent.createMany({
      data: mealIds.map((mealId) => ({
        mealId,
        status: MealStatus.PREPARING,
        userId,
      })),
    });

    return { updated: mealIds.length, status: MealStatus.PREPARING };
  }

  /**
   * Mark meals as PACKED (Kitchen finished packing).
   */
  async markPacked(propertyId: string, mealIds: string[], userId: string) {
    await this.prisma.meal.updateMany({
      where: {
        id: { in: mealIds },
        propertyId,
        status: MealStatus.PREPARING,
      },
      data: { status: MealStatus.PACKED },
    });

    await this.prisma.mealEvent.createMany({
      data: mealIds.map((mealId) => ({
        mealId,
        status: MealStatus.PACKED,
        userId,
      })),
    });

    return { updated: mealIds.length, status: MealStatus.PACKED };
  }
}
