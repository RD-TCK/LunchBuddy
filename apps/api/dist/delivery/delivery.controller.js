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
exports.DeliveryController = void 0;
const common_1 = require("@nestjs/common");
const delivery_service_1 = require("./delivery.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const types_1 = require("@mealflow/types");
const class_validator_1 = require("class-validator");
class CreateBatchDto {
}
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBatchDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(types_1.MealType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBatchDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBatchDto.prototype, "assignedToId", void 0);
class ScanDeliverDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ScanDeliverDto.prototype, "qrToken", void 0);
let DeliveryController = class DeliveryController {
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
    }
    createBatch(propertyId, body, req) {
        return this.deliveryService.createBatch(propertyId, body.date, body.type, body.assignedToId, req.user.id);
    }
    findBatches(propertyId) {
        return this.deliveryService.findBatches(propertyId);
    }
    dispatchBatch(propertyId, batchId, req) {
        return this.deliveryService.dispatchBatch(batchId, propertyId, req.user.id);
    }
    scanAndDeliver(propertyId, body, req) {
        return this.deliveryService.scanAndDeliver(body.qrToken, propertyId, req.user.id);
    }
};
exports.DeliveryController = DeliveryController;
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Post)('batches'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateBatchDto, Object]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "createBatch", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.DELIVERY_STAFF),
    (0, common_1.Get)('batches'),
    __param(0, (0, common_1.Param)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findBatches", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.DELIVERY_STAFF),
    (0, common_1.Post)('batches/:batchId/dispatch'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Param)('batchId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "dispatchBatch", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.DELIVERY_STAFF),
    (0, common_1.Post)('scan'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ScanDeliverDto, Object]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "scanAndDeliver", null);
exports.DeliveryController = DeliveryController = __decorate([
    (0, common_1.Controller)('properties/:propertyId/delivery'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService])
], DeliveryController);
//# sourceMappingURL=delivery.controller.js.map