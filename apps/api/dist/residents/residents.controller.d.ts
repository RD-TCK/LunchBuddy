import { ResidentsService } from "./residents.service";
import { CreateResidentDto } from "./dto/create-resident.dto";
import { UpdateResidentDto } from "./dto/update-resident.dto";
import { ImportResidentsDto } from "./dto/import-residents.dto";
import { PrismaService } from "../prisma/prisma.service";
export declare class ResidentsController {
    private readonly residentsService;
    private readonly prisma;
    constructor(residentsService: ResidentsService, prisma: PrismaService);
    create(propertyId: string, createResidentDto: CreateResidentDto): Promise<{
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
    import(propertyId: string, importResidentsDto: ImportResidentsDto): Promise<{
        successful: number;
        failed: number;
        errors: any[];
    }>;
    private verifyResidentAccess;
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateResidentDto: UpdateResidentDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
