import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateResidentDto } from "./dto/create-resident.dto";
import { UpdateResidentDto } from "./dto/update-resident.dto";
export declare class ResidentsService {
    private prisma;
    private usersService;
    constructor(prisma: PrismaService, usersService: UsersService);
    create(propertyId: string, dto: CreateResidentDto): Promise<{
        user: {
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
        };
        room: {
            id: string;
            propertyId: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: string | null;
            capacity: number;
        };
    } & {
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string | null;
        residentCode: string | null;
        mealPlan: import("@prisma/client").$Enums.MealPlan;
        status: import("@prisma/client").$Enums.ResidentStatus;
        userId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }>;
    findAll(propertyId: string): Promise<({
        user: {
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
        };
        room: {
            id: string;
            propertyId: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: string | null;
            capacity: number;
        };
    } & {
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string | null;
        residentCode: string | null;
        mealPlan: import("@prisma/client").$Enums.MealPlan;
        status: import("@prisma/client").$Enums.ResidentStatus;
        userId: string;
        joinedAt: Date;
        leftAt: Date | null;
    })[]>;
    findOne(propertyId: string, id: string): Promise<{
        user: {
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
        };
        room: {
            id: string;
            propertyId: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: string | null;
            capacity: number;
        };
    } & {
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string | null;
        residentCode: string | null;
        mealPlan: import("@prisma/client").$Enums.MealPlan;
        status: import("@prisma/client").$Enums.ResidentStatus;
        userId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }>;
    update(propertyId: string, id: string, dto: UpdateResidentDto): Promise<{
        user: {
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
        };
        room: {
            id: string;
            propertyId: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: string | null;
            capacity: number;
        };
    } & {
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string | null;
        residentCode: string | null;
        mealPlan: import("@prisma/client").$Enums.MealPlan;
        status: import("@prisma/client").$Enums.ResidentStatus;
        userId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }>;
    remove(propertyId: string, id: string): Promise<{
        success: boolean;
    }>;
    importResidents(propertyId: string, residents: CreateResidentDto[]): Promise<{
        successful: number;
        failed: number;
        errors: any[];
    }>;
}
