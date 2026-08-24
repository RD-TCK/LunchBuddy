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
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenusService = class MenusService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMenuDto) {
        const existingMenu = await this.prisma.menu.findUnique({
            where: {
                propertyId_date_type: {
                    propertyId: createMenuDto.propertyId,
                    date: new Date(createMenuDto.date),
                    type: createMenuDto.type,
                },
            },
        });
        if (existingMenu) {
            throw new common_1.ConflictException('Menu already exists for this date and type');
        }
        return this.prisma.menu.create({
            data: {
                ...createMenuDto,
                date: new Date(createMenuDto.date),
            },
        });
    }
    findAll(propertyId) {
        return this.prisma.menu.findMany({
            where: { propertyId },
            orderBy: { date: 'asc' },
        });
    }
    async findOne(id, propertyId) {
        const menu = await this.prisma.menu.findUnique({
            where: { id, propertyId },
        });
        if (!menu) {
            throw new common_1.NotFoundException(`Menu with ID ${id} not found`);
        }
        return menu;
    }
    async update(id, propertyId, updateMenuDto) {
        await this.findOne(id, propertyId);
        if (updateMenuDto.date || updateMenuDto.type) {
            const existingMenu = await this.prisma.menu.findFirst({
                where: {
                    propertyId,
                    date: updateMenuDto.date ? new Date(updateMenuDto.date) : undefined,
                    type: updateMenuDto.type,
                    id: { not: id }
                }
            });
            if (existingMenu) {
                throw new common_1.ConflictException('Another menu already exists for this date and type');
            }
        }
        const data = { ...updateMenuDto };
        if (data.date) {
            data.date = new Date(data.date);
        }
        return this.prisma.menu.update({
            where: { id },
            data,
        });
    }
    async remove(id, propertyId) {
        await this.findOne(id, propertyId);
        return this.prisma.menu.delete({
            where: { id },
        });
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenusService);
//# sourceMappingURL=menus.service.js.map