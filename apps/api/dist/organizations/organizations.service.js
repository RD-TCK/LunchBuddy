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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrganizationsService = class OrganizationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException("Creator user not found");
        }
        if (user.organizationId) {
            throw new common_1.ConflictException("User is already associated with an organization");
        }
        return this.prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name: dto.name,
                },
            });
            await tx.user.update({
                where: { id: userId },
                data: {
                    organizationId: org.id,
                },
            });
            return org;
        });
    }
    async findOne(id) {
        const org = await this.prisma.organization.findUnique({
            where: { id },
        });
        if (!org) {
            throw new common_1.NotFoundException("Organization not found");
        }
        return org;
    }
    async update(id, dto) {
        const org = await this.findOne(id);
        return this.prisma.organization.update({
            where: { id: org.id },
            data: dto,
        });
    }
    async remove(id) {
        const org = await this.findOne(id);
        await this.prisma.organization.delete({
            where: { id: org.id },
        });
        return { success: true };
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map