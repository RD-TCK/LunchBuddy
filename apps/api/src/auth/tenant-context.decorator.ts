import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserRole } from "@mealflow/types";

export interface ITenantContext {
  userId: string;
  role: UserRole;
  organizationId: string | null;
  propertyId: string | null;
}

export const TenantContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ITenantContext => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return {
      userId: user?.id || null,
      role: user?.role || null,
      organizationId: user?.organizationId || null,
      propertyId: user?.propertyId || null,
    };
  },
);
