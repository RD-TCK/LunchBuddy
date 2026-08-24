"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const types_1 = require("@mealflow/types");
let DeliveryService = class DeliveryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBatch(propertyId, date, type, assignedToId, createdById) {
        const batch = await this.prisma.deliveryBatch.create({
            data: {
                propertyId,
                date: new Date(date),
                type,
                assignedToId,
                status: 'ASSIGNED',
            },
        });
        const targetDate = new Date(date);
        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const packedMeals = await this.prisma.meal.findMany({
            where: {
                propertyId,
                status: types_1.MealStatus.PACKED,
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
            throw new common_1.BadRequestException('No PACKED meals found for this date and type');
        }
        await this.prisma.meal.updateMany({
            where: { id: { in: packedMeals.map((m) => m.id) } },
            data: {
                deliveryBatchId: batch.id,
                status: types_1.MealStatus.ASSIGNED,
            },
        });
        await this.prisma.mealEvent.createMany({
            data: packedMeals.map((meal) => ({
                mealId: meal.id,
                status: types_1.MealStatus.ASSIGNED,
                userId: createdById,
            })),
        });
        return {
            ...batch,
            mealsAssigned: packedMeals.length,
        };
    }
    findBatches(propertyId) {
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
    async dispatchBatch(batchId, propertyId, userId) {
        const batch = await this.prisma.deliveryBatch.findUnique({
            where: { id: batchId, propertyId },
        });
        if (!batch)
            throw new common_1.NotFoundException('Delivery batch not found');
        await this.prisma.meal.updateMany({
            where: { deliveryBatchId: batchId, status: types_1.MealStatus.ASSIGNED },
            data: { status: types_1.MealStatus.DISPATCHED },
        });
        const updated = await this.prisma.meal.findMany({
            where: { deliveryBatchId: batchId },
        });
        await this.prisma.mealEvent.createMany({
            data: updated.map((meal) => ({
                mealId: meal.id,
                status: types_1.MealStatus.DISPATCHED,
                userId,
            })),
        });
        await this.prisma.deliveryBatch.update({
            where: { id: batchId },
            data: { status: 'DISPATCHED' },
        });
        return { batchId, dispatched: updated.length };
    }
    async scanAndDeliver(qrToken, propertyId, userId) {
        const meal = await this.prisma.meal.findUnique({
            where: { qrToken },
            include: {
                resident: { include: { user: { select: { name: true } } } },
                room: true,
                booking: { include: { menu: true } },
            },
        });
        if (!meal)
            throw new common_1.NotFoundException('Meal not found for this QR token');
        if (meal.propertyId !== propertyId) {
            throw new common_1.BadRequestException('This meal does not belong to your property');
        }
        if (meal.status !== types_1.MealStatus.DISPATCHED) {
            throw new common_1.BadRequestException(`Cannot deliver a meal with status: ${meal.status}`);
        }
        const updatedMeal = await this.prisma.meal.update({
            where: { id: meal.id },
            data: { status: types_1.MealStatus.DELIVERED },
            include: {
                resident: { include: { user: { select: { name: true } } } },
                room: true,
            },
        });
        await this.prisma.mealEvent.create({
            data: {
                mealId: meal.id,
                status: types_1.MealStatus.DELIVERED,
                userId,
            },
        });
        if (meal.deliveryBatchId) {
            const pendingMeals = await this.prisma.meal.count({
                where: {
                    deliveryBatchId: meal.deliveryBatchId,
                    status: { not: types_1.MealStatus.DELIVERED },
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
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map