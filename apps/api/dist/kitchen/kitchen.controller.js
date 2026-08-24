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
exports.KitchenController = void 0;
const common_1 = require("@nestjs/common");
const kitchen_service_1 = require("./kitchen.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const types_1 = require("@mealflow/types");
const class_validator_1 = require("class-validator");
class BatchActionDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    __metadata("design:type", Array)
], BatchActionDto.prototype, "mealIds", void 0);
let KitchenController = class KitchenController {
    constructor(kitchenService) {
        this.kitchenService = kitchenService;
    }
    getDashboard(propertyId, date) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        return this.kitchenService.getDashboard(propertyId, targetDate);
    }
    startPreparing(propertyId, body, req) {
        return this.kitchenService.startPreparing(propertyId, body.mealIds, req.user.id);
    }
    markPacked(propertyId, body, req) {
        return this.kitchenService.markPacked(propertyId, body.mealIds, req.user.id);
    }
};
exports.KitchenController = KitchenController;
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.KITCHEN_STAFF),
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], KitchenController.prototype, "getDashboard", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.KITCHEN_STAFF),
    (0, common_1.Post)('start-preparing'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, BatchActionDto, Object]),
    __metadata("design:returntype", void 0)
], KitchenController.prototype, "startPreparing", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.KITCHEN_STAFF),
    (0, common_1.Post)('mark-packed'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, BatchActionDto, Object]),
    __metadata("design:returntype", void 0)
], KitchenController.prototype, "markPacked", null);
exports.KitchenController = KitchenController = __decorate([
    (0, common_1.Controller)('properties/:propertyId/kitchen'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [kitchen_service_1.KitchenService])
], KitchenController);
//# sourceMappingURL=kitchen.controller.js.map