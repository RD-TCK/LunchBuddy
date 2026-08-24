import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "@mealflow/database";
import { UserRole } from "@mealflow/types";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    hashPassword(password: string): Promise<string>;
    register(email: string, password: string, name?: string, role?: UserRole): Promise<User>;
    validateUser(email: string, pass: string): Promise<any>;
    login(user: Omit<User, "passwordHash" | "refreshTokenHash">): Promise<{
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
    refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
}
