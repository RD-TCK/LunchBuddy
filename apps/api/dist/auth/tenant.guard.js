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
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TenantGuard = class TenantGuard {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        const params = request.params;
        const body = request.body;
        const url = request.url;
        let organizationId = params.organizationId || body.organizationId;
        let propertyId = params.propertyId || body.propertyId;
        if (url.includes("/organizations/")) {
            const idParam = params.id;
            if (idParam) {
                organizationId = idParam;
            }
        }
        if (url.includes("/properties/")) {
            const idParam = params.id;
            if (idParam) {
                propertyId = idParam;
            }
        }
        if (organizationId) {
            if (user.organizationId && user.organizationId !== organizationId) {
                throw new common_1.ForbiddenException("Cross-tenant organization access denied");
            }
        }
        if (propertyId) {
            const property = await this.prisma.property.findUnique({
                where: { id: propertyId },
            });
            if (!property) {
                throw new common_1.NotFoundException("Property not found");
            }
            if (user.organizationId &&
                property.organizationId !== user.organizationId) {
                throw new common_1.ForbiddenException("Cross-tenant property access denied");
            }
            if (user.propertyId && property.id !== user.propertyId) {
                throw new common_1.ForbiddenException("Property scope access denied");
            }
        }
        return true;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map