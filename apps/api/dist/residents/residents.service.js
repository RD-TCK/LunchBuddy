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
exports.ResidentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const types_1 = require("@mealflow/types");
const bcrypt = require("bcrypt");
let ResidentsService = class ResidentsService {
    constructor(prisma, usersService) {
        this.prisma = prisma;
        this.usersService = usersService;
    }
    async create(propertyId, dto) {
        if (dto.roomId) {
            const room = await this.prisma.room.findUnique({
                where: { id: dto.roomId },
            });
            if (!room || room.propertyId !== propertyId) {
                throw new common_1.BadRequestException("Room does not belong to this property");
            }
        }
        return this.prisma.$transaction(async (tx) => {
            let user = await tx.user.findUnique({
                where: { email: dto.email },
            });
            if (!user) {
                const hashedPassword = await bcrypt.hash("resident123", 10);
                user = await tx.user.create({
                    data: {
                        email: dto.email,
                        name: dto.name,
                        passwordHash: hashedPassword,
                        role: types_1.UserRole.RESIDENT,
                        propertyId: propertyId,
                    },
                });
            }
            else {
                const existingResident = await tx.resident.findUnique({
                    where: { userId: user.id },
                });
                if (existingResident) {
                    throw new common_1.ConflictException("User is already a resident");
                }
            }
            return tx.resident.create({
                data: {
                    userId: user.id,
                    propertyId,
                    roomId: dto.roomId,
                    residentCode: dto.residentCode,
                    mealPlan: dto.mealPlan || "STANDARD",
                    status: dto.status || "ACTIVE",
                },
                include: { user: true, room: true },
            });
        });
    }
    async findAll(propertyId) {
        return this.prisma.resident.findMany({
            where: { propertyId },
            include: { user: true, room: true },
        });
    }
    async findOne(propertyId, id) {
        const resident = await this.prisma.resident.findFirst({
            where: { id, propertyId },
            include: { user: true, room: true },
        });
        if (!resident) {
            throw new common_1.NotFoundException("Resident not found in this property");
        }
        return resident;
    }
    async update(propertyId, id, dto) {
        const resident = await this.findOne(propertyId, id);
        if (dto.roomId) {
            const room = await this.prisma.room.findUnique({
                where: { id: dto.roomId },
            });
            if (!room || room.propertyId !== propertyId) {
                throw new common_1.BadRequestException("Room does not belong to this property");
            }
        }
        return this.prisma.$transaction(async (tx) => {
            if (dto.name || dto.email || dto.phone) {
                await tx.user.update({
                    where: { id: resident.userId },
                    data: {
                        name: dto.name,
                        email: dto.email,
                    },
                });
            }
            return tx.resident.update({
                where: { id },
                data: {
                    roomId: dto.roomId,
                    residentCode: dto.residentCode,
                    mealPlan: dto.mealPlan,
                    status: dto.status,
                    leftAt: dto.status === "INACTIVE" ? new Date() : null,
                },
                include: { user: true, room: true },
            });
        });
    }
    async remove(propertyId, id) {
        const resident = await this.findOne(propertyId, id);
        await this.prisma.resident.delete({
            where: { id: resident.id },
        });
        return { success: true };
    }
    async importResidents(propertyId, residents) {
        const results = { successful: 0, failed: 0, errors: [] };
        for (const resDto of residents) {
            try {
                await this.create(propertyId, resDto);
                results.successful++;
            }
            catch (error) {
                results.failed++;
                results.errors.push({ email: resDto.email, error: error.message });
            }
        }
        return results;
    }
};
exports.ResidentsService = ResidentsService;
exports.ResidentsService = ResidentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], ResidentsService);
//# sourceMappingURL=residents.service.js.map