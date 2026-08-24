import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const params = request.params;
    const body = request.body;
    const url = request.url;

    // 1. Resolve organizationId and propertyId from params or body
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

    // 2. Enforce Organization Isolation
    if (organizationId) {
      if (user.organizationId && user.organizationId !== organizationId) {
        throw new ForbiddenException("Cross-tenant organization access denied");
      }
    }

    // 3. Enforce Property Isolation
    if (propertyId) {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
      });

      if (!property) {
        throw new NotFoundException("Property not found");
      }

      // Check cross-tenant property access
      if (
        user.organizationId &&
        property.organizationId !== user.organizationId
      ) {
        throw new ForbiddenException("Cross-tenant property access denied");
      }

      // Check property scope access for scoped staff/residents
      if (user.propertyId && property.id !== user.propertyId) {
        throw new ForbiddenException("Property scope access denied");
      }
    }

    return true;
  }
}
