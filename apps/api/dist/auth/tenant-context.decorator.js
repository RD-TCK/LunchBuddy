"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantContext = void 0;
const common_1 = require("@nestjs/common");
exports.TenantContext = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return {
        userId: user?.id || null,
        role: user?.role || null,
        organizationId: user?.organizationId || null,
        propertyId: user?.propertyId || null,
    };
});
//# sourceMappingURL=tenant-context.decorator.js.map