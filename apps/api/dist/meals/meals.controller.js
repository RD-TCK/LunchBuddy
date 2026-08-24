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
exports.MealsController = void 0;
const common_1 = require("@nestjs/common");
const meals_service_1 = require("./meals.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const types_1 = require("@mealflow/types");
const class_validator_1 = require("class-validator");
class GenerateMealsDto {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateMealsDto.prototype, "menuId", void 0);
class UpdateStatusDto {
}
__decorate([
    (0, class_validator_1.IsEnum)(types_1.MealStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateStatusDto.prototype, "status", void 0);
let MealsController = class MealsController {
    constructor(mealsService) {
        this.mealsService = mealsService;
    }
    generate(propertyId, dto, req) {
        return this.mealsService.generateFromMenu(dto.menuId, propertyId, req.user.id);
    }
    findAll(propertyId) {
        return this.mealsService.findAll(propertyId);
    }
    findOne(propertyId, id) {
        return this.mealsService.findOne(id, propertyId);
    }
    updateStatus(propertyId, id, dto, req) {
        return this.mealsService.updateStatus(id, propertyId, dto.status, req.user.id);
    }
    remove(propertyId, id) {
        return this.mealsService.remove(id, propertyId);
    }
};
exports.MealsController = MealsController;
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, GenerateMealsDto, Object]),
    __metadata("design:returntype", void 0)
], MealsController.prototype, "generate", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.KITCHEN_STAFF, types_1.UserRole.DELIVERY_STAFF, types_1.UserRole.RESIDENT),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MealsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.KITCHEN_STAFF, types_1.UserRole.DELIVERY_STAFF, types_1.UserRole.RESIDENT),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MealsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.KITCHEN_STAFF, types_1.UserRole.DELIVERY_STAFF),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateStatusDto, Object]),
    __metadata("design:returntype", void 0)
], MealsController.prototype, "updateStatus", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MealsController.prototype, "remove", null);
exports.MealsController = MealsController = __decorate([
    (0, common_1.Controller)('properties/:propertyId/meals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [meals_service_1.MealsService])
], MealsController);
//# sourceMappingURL=meals.controller.js.map