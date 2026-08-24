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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResidentsController = void 0;
const common_1 = require("@nestjs/common");
const residents_service_1 = require("./residents.service");
const create_resident_dto_1 = require("./dto/create-resident.dto");
const update_resident_dto_1 = require("./dto/update-resident.dto");
const import_residents_dto_1 = require("./dto/import-residents.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const types_1 = require("@mealflow/types");
const prisma_service_1 = require("../prisma/prisma.service");
let ResidentsController = class ResidentsController {
    constructor(residentsService, prisma) {
        this.residentsService = residentsService;
        this.prisma = prisma;
    }
    async create(propertyId, createResidentDto) {
        return this.residentsService.create(propertyId, createResidentDto);
    }
    async findAll(propertyId) {
        return this.residentsService.findAll(propertyId);
    }
    async import(propertyId, importResidentsDto) {
        return this.residentsService.importResidents(propertyId, importResidentsDto.residents);
    }
    async verifyResidentAccess(req, residentId) {
        const resident = await this.prisma.resident.findUnique({
            where: { id: residentId },
            include: { property: true },
        });
        if (!resident) {
            throw new common_1.NotFoundException("Resident not found");
        }
        if (req.user.organizationId &&
            resident.property.organizationId !== req.user.organizationId) {
            throw new common_1.ForbiddenException("Cross-tenant access denied");
        }
        if (req.user.propertyId && resident.propertyId !== req.user.propertyId) {
            throw new common_1.ForbiddenException("Cross-property access denied");
        }
        return resident.propertyId;
    }
    async findOne(id, req) {
        const propertyId = await this.verifyResidentAccess(req, id);
        return this.residentsService.findOne(propertyId, id);
    }
    async update(id, updateResidentDto, req) {
        const propertyId = await this.verifyResidentAccess(req, id);
        return this.residentsService.update(propertyId, id, updateResidentDto);
    }
    async remove(id, req) {
        const propertyId = await this.verifyResidentAccess(req, id);
        return this.residentsService.remove(propertyId, id);
    }
};
exports.ResidentsController = ResidentsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Post)("properties/:propertyId/residents"),
    __param(0, (0, common_1.Param)("propertyId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_resident_dto_1.CreateResidentDto]),
    __metadata("design:returntype", Promise)
], ResidentsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Get)("properties/:propertyId/residents"),
    __param(0, (0, common_1.Param)("propertyId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResidentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Post)("properties/:propertyId/residents/import"),
    __param(0, (0, common_1.Param)("propertyId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, import_residents_dto_1.ImportResidentsDto]),
    __metadata("design:returntype", Promise)
], ResidentsController.prototype, "import", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Get)("residents/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResidentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Patch)("residents/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_resident_dto_1.UpdateResidentDto, Object]),
    __metadata("design:returntype", Promise)
], ResidentsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Delete)("residents/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResidentsController.prototype, "remove", null);
exports.ResidentsController = ResidentsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [residents_service_1.ResidentsService,
        prisma_service_1.PrismaService])
], ResidentsController);
//# sourceMappingURL=residents.controller.js.map