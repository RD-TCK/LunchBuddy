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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBookingDto) {
        const existingBooking = await this.prisma.booking.findUnique({
            where: {
                menuId_residentId: {
                    menuId: createBookingDto.menuId,
                    residentId: createBookingDto.residentId,
                },
            },
        });
        if (existingBooking) {
            throw new common_1.ConflictException('Booking already exists for this menu and resident');
        }
        return this.prisma.booking.create({
            data: createBookingDto,
        });
    }
    findAll(propertyId) {
        return this.prisma.booking.findMany({
            where: { propertyId },
            include: {
                menu: true,
                resident: { include: { user: { select: { name: true, email: true } } } }
            }
        });
    }
    async findOne(id, propertyId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id, propertyId },
            include: {
                menu: true,
                resident: true
            }
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async update(id, propertyId, updateBookingDto) {
        await this.findOne(id, propertyId);
        return this.prisma.booking.update({
            where: { id },
            data: updateBookingDto,
        });
    }
    async remove(id, propertyId) {
        await this.findOne(id, propertyId);
        return this.prisma.booking.delete({
            where: { id },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map