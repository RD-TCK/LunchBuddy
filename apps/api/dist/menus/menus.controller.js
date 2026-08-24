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
exports.MenusController = void 0;
const common_1 = require("@nestjs/common");
const menus_service_1 = require("./menus.service");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const types_1 = require("@mealflow/types");
let MenusController = class MenusController {
    constructor(menusService) {
        this.menusService = menusService;
    }
    create(propertyId, createMenuDto) {
        if (createMenuDto.propertyId !== propertyId) {
            throw new common_1.ForbiddenException('Property ID mismatch');
        }
        return this.menusService.create(createMenuDto);
    }
    findAll(propertyId) {
        return this.menusService.findAll(propertyId);
    }
    findOne(propertyId, id) {
        return this.menusService.findOne(id, propertyId);
    }
    update(propertyId, id, updateMenuDto) {
        if (updateMenuDto.propertyId && updateMenuDto.propertyId !== propertyId) {
            throw new common_1.ForbiddenException('Cannot change property ID');
        }
        return this.menusService.update(id, propertyId, updateMenuDto);
    }
    remove(propertyId, id) {
        return this.menusService.remove(id, propertyId);
    }
};
exports.MenusController = MenusController;
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_menu_dto_1.CreateMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.KITCHEN_STAFF, types_1.UserRole.DELIVERY_STAFF, types_1.UserRole.RESIDENT),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER, types_1.UserRole.KITCHEN_STAFF, types_1.UserRole.DELIVERY_STAFF, types_1.UserRole.RESIDENT),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_menu_dto_1.UpdateMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(types_1.UserRole.OWNER, types_1.UserRole.ADMIN, types_1.UserRole.MANAGER),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "remove", null);
exports.MenusController = MenusController = __decorate([
    (0, common_1.Controller)('properties/:propertyId/menus'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [menus_service_1.MenusService])
], MenusController);
//# sourceMappingURL=menus.controller.js.map