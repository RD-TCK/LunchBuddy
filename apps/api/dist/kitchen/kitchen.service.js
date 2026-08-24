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
exports.KitchenService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const types_1 = require("@mealflow/types");
let KitchenService = class KitchenService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(propertyId, date) {
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
        const byStatus = meals.reduce((acc, meal) => {
            acc[meal.status] = (acc[meal.status] || 0) + 1;
            return acc;
        }, {});
        return {
            date,
            total,
            byStatus,
            meals,
        };
    }
    async startPreparing(propertyId, mealIds, userId) {
        await this.prisma.meal.updateMany({
            where: {
                id: { in: mealIds },
                propertyId,
                status: types_1.MealStatus.BOOKED,
            },
            data: { status: types_1.MealStatus.PREPARING },
        });
        await this.prisma.mealEvent.createMany({
            data: mealIds.map((mealId) => ({
                mealId,
                status: types_1.MealStatus.PREPARING,
                userId,
            })),
        });
        return { updated: mealIds.length, status: types_1.MealStatus.PREPARING };
    }
    async markPacked(propertyId, mealIds, userId) {
        await this.prisma.meal.updateMany({
            where: {
                id: { in: mealIds },
                propertyId,
                status: types_1.MealStatus.PREPARING,
            },
            data: { status: types_1.MealStatus.PACKED },
        });
        await this.prisma.mealEvent.createMany({
            data: mealIds.map((mealId) => ({
                mealId,
                status: types_1.MealStatus.PACKED,
                userId,
            })),
        });
        return { updated: mealIds.length, status: types_1.MealStatus.PACKED };
    }
};
exports.KitchenService = KitchenService;
exports.KitchenService = KitchenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KitchenService);
//# sourceMappingURL=kitchen.service.js.map