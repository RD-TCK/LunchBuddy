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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PropertiesService = class PropertiesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const org = await this.prisma.organization.findUnique({
            where: { id: dto.organizationId },
        });
        if (!org) {
            throw new common_1.NotFoundException("Organization not found");
        }
        return this.prisma.property.create({
            data: dto,
        });
    }
    async findAll(organizationId) {
        return this.prisma.property.findMany({
            where: { organizationId },
        });
    }
    async findOne(id) {
        const prop = await this.prisma.property.findUnique({
            where: { id },
        });
        if (!prop) {
            throw new common_1.NotFoundException("Property not found");
        }
        return prop;
    }
    async update(id, dto) {
        const prop = await this.findOne(id);
        return this.prisma.property.update({
            where: { id: prop.id },
            data: dto,
        });
    }
    async remove(id) {
        const prop = await this.findOne(id);
        await this.prisma.property.delete({
            where: { id: prop.id },
        });
        return { success: true };
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map