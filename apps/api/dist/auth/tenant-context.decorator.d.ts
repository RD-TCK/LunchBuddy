import { UserRole } from "@mealflow/types";
export interface ITenantContext {
    userId: string;
    role: UserRole;
    organizationId: string | null;
    propertyId: string | null;
}
export declare const TenantContext: (...dataOrPipes: unknown[]) => ParameterDecorator;
