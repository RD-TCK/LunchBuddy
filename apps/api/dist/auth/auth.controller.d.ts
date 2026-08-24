import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UserRole } from "@mealflow/types";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        refreshTokenHash: string | null;
        isActive: boolean;
        organizationId: string | null;
        propertyId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    registerStaff(registerDto: RegisterDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        refreshTokenHash: string | null;
        isActive: boolean;
        organizationId: string | null;
        propertyId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: UserRole;
            isActive: boolean;
            organizationId: string;
            propertyId: string;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        success: boolean;
    }>;
}
