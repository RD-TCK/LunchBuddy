import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MealStatus, MealType } from '@mealflow/types';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a delivery batch and assign PACKED meals to it.
   */
  async createBatch(
    propertyId: string,
    date: string,
    type: MealType,
    assignedToId: string,
    createdById: string,
  ) {
    const batch = await this.prisma.deliveryBatch.create({
      data: {
        propertyId,
        date: new Date(date),
        type,
        assignedToId,
        status: 'ASSIGNED',
      },
    });

    // Get all PACKED meals for this property/date/type
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const packedMeals = await this.prisma.meal.findMany({
      where: {
        propertyId,
        status: MealStatus.PACKED,
        booking: {
          menu: {
            type,
            date: {
              gte: targetDate,
              lt: nextDate,
            },
          },
        },
      },
    });

    if (packedMeals.length === 0) {
      throw new BadRequestException('No PACKED meals found for this date and type');
    }

    // Assign meals to batch
    await this.prisma.meal.updateMany({
      where: { id: { in: packedMeals.map((m) => m.id) } },
      data: {
        deliveryBatchId: batch.id,
        status: MealStatus.ASSIGNED,
      },
    });

    await this.prisma.mealEvent.createMany({
      data: packedMeals.map((meal) => ({
        mealId: meal.id,
        status: MealStatus.ASSIGNED,
        userId: createdById,
      })),
    });

    return {
      ...batch,
      mealsAssigned: packedMeals.length,
    };
  }

  /**
   * Get all delivery batches for a property.
   */
  findBatches(propertyId: string) {
    return this.prisma.deliveryBatch.findMany({
      where: { propertyId },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        meals: {
          include: {
            resident: {
              include: { user: { select: { name: true } } },
            },
            room: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Dispatch all ASSIGNED meals in a batch.
   */
  async dispatchBatch(batchId: string, propertyId: string, userId: string) {
    const batch = await this.prisma.deliveryBatch.findUnique({
      where: { id: batchId, propertyId },
    });
    if (!batch) throw new NotFoundException('Delivery batch not found');

    await this.prisma.meal.updateMany({
      where: { deliveryBatchId: batchId, status: MealStatus.ASSIGNED },
      data: { status: MealStatus.DISPATCHED },
    });

    const updated = await this.prisma.meal.findMany({
      where: { deliveryBatchId: batchId },
    });

    await this.prisma.mealEvent.createMany({
      data: updated.map((meal) => ({
        mealId: meal.id,
        status: MealStatus.DISPATCHED,
        userId,
      })),
    });

    await this.prisma.deliveryBatch.update({
      where: { id: batchId },
      data: { status: 'DISPATCHED' },
    });

    return { batchId, dispatched: updated.length };
  }

  /**
   * Scan a QR token and mark meal as DELIVERED.
   */
  async scanAndDeliver(qrToken: string, propertyId: string, userId: string) {
    const meal = await this.prisma.meal.findUnique({
      where: { qrToken },
      include: {
        resident: { include: { user: { select: { name: true } } } },
        room: true,
        booking: { include: { menu: true } },
      },
    });

    if (!meal) throw new NotFoundException('Meal not found for this QR token');

    // Tenant check
    if (meal.propertyId !== propertyId) {
      throw new BadRequestException('This meal does not belong to your property');
    }

    if (meal.status !== MealStatus.DISPATCHED) {
      throw new BadRequestException(
        `Cannot deliver a meal with status: ${meal.status}`,
      );
    }

    const updatedMeal = await this.prisma.meal.update({
      where: { id: meal.id },
      data: { status: MealStatus.DELIVERED },
      include: {
        resident: { include: { user: { select: { name: true } } } },
        room: true,
      },
    });

    await this.prisma.mealEvent.create({
      data: {
        mealId: meal.id,
        status: MealStatus.DELIVERED,
        userId,
      },
    });

    // Check if all meals in batch are delivered → complete batch
    if (meal.deliveryBatchId) {
      const pendingMeals = await this.prisma.meal.count({
        where: {
          deliveryBatchId: meal.deliveryBatchId,
          status: { not: MealStatus.DELIVERED },
        },
      });

      if (pendingMeals === 0) {
        await this.prisma.deliveryBatch.update({
          where: { id: meal.deliveryBatchId },
          data: { status: 'COMPLETED' },
        });
      }
    }

    return updatedMeal;
  }
}
