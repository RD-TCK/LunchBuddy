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
exports.MealsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const types_1 = require("@mealflow/types");
const crypto_1 = require("crypto");
let MealsService = class MealsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateFromMenu(menuId, propertyId, userId) {
        const menu = await this.prisma.menu.findUnique({
            where: { id: menuId, propertyId },
            include: {
                bookings: {
                    where: { status: 'BOOKED' },
                    include: { resident: true },
                },
            },
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found');
        const bookedBookings = menu.bookings;
        if (bookedBookings.length === 0) {
            return { generated: 0, message: 'No BOOKED bookings found for this menu' };
        }
        const existingMeals = await this.prisma.meal.findMany({
            where: {
                bookingId: { in: bookedBookings.map((b) => b.id) },
            },
            select: { bookingId: true },
        });
        const existingBookingIds = new Set(existingMeals.map((m) => m.bookingId));
        const newBookings = bookedBookings.filter((b) => !existingBookingIds.has(b.id));
        if (newBookings.length === 0) {
            return { generated: 0, message: 'All bookings already have meals generated' };
        }
        const meals = await this.prisma.$transaction(newBookings.map((booking) => this.prisma.meal.create({
            data: {
                propertyId,
                bookingId: booking.id,
                residentId: booking.residentId,
                roomId: booking.resident.roomId,
                status: types_1.MealStatus.BOOKED,
                qrToken: (0, crypto_1.randomUUID)(),
            },
        })));
        await this.prisma.mealEvent.createMany({
            data: meals.map((meal) => ({
                mealId: meal.id,
                status: types_1.MealStatus.BOOKED,
                userId,
            })),
        });
        return { generated: meals.length, mealIds: meals.map((m) => m.id) };
    }
    findAll(propertyId) {
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
    async findOne(id, propertyId) {
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
        if (!meal)
            throw new common_1.NotFoundException('Meal not found');
        return meal;
    }
    async updateStatus(id, propertyId, status, userId) {
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
    async remove(id, propertyId) {
        await this.findOne(id, propertyId);
        return this.prisma.meal.delete({ where: { id } });
    }
};
exports.MealsService = MealsService;
exports.MealsService = MealsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MealsService);
//# sourceMappingURL=meals.service.js.map