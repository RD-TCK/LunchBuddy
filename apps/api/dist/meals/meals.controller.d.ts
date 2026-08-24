import { MealsService } from './meals.service';
import { MealStatus } from '@mealflow/types';
declare class GenerateMealsDto {
    menuId: string;
}
declare class UpdateStatusDto {
    status: MealStatus;
}
export declare class MealsController {
    private readonly mealsService;
    constructor(mealsService: MealsService);
    generate(propertyId: string, dto: GenerateMealsDto, req: any): Promise<{
        generated: number;
        message: string;
        mealIds?: undefined;
    } | {
        generated: number;
        mealIds: string[];
        message?: undefined;
    }>;
    findAll(propertyId: string): import("@prisma/client").Prisma.PrismaPromise<({
        room: {
            id: string;
            propertyId: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: string | null;
            capacity: number;
        };
        resident: {
            user: {
                name: string;
                email: string;
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
        };
        booking: {
            menu: {
                id: string;
                propertyId: string;
                createdAt: Date;
                updatedAt: Date;
                date: Date;
                type: import("@prisma/client").$Enums.MealType;
                title: string;
                description: string | null;
            };
        } & {
            id: string;
            propertyId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            menuId: string;
            residentId: string;
        };
    } & {
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string | null;
        status: import("@prisma/client").$Enums.MealStatus;
        residentId: string;
        bookingId: string;
        deliveryBatchId: string | null;
        qrToken: string;
    })[]>;
    findOne(propertyId: string, id: string): Promise<{
        room: {
            id: string;
            propertyId: string;
            createdAt: Date;
            updatedAt: Date;
            roomNumber: string;
            floor: string | null;
            capacity: number;
        };
        resident: {
            user: {
                name: string;
                email: string;
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
        };
        booking: {
            menu: {
                id: string;
                propertyId: string;
                createdAt: Date;
                updatedAt: Date;
                date: Date;
                type: import("@prisma/client").$Enums.MealType;
                title: string;
                description: string | null;
            };
        } & {
            id: string;
            propertyId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            menuId: string;
            residentId: string;
        };
        events: ({
            user: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.MealStatus;
            userId: string | null;
            mealId: string;
            notes: string | null;
        })[];
    } & {
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string | null;
        status: import("@prisma/client").$Enums.MealStatus;
        residentId: string;
        bookingId: string;
        deliveryBatchId: string | null;
        qrToken: string;
    }>;
    updateStatus(propertyId: string, id: string, dto: UpdateStatusDto, req: any): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string | null;
        status: import("@prisma/client").$Enums.MealStatus;
        residentId: string;
        bookingId: string;
        deliveryBatchId: string | null;
        qrToken: string;
    }>;
    remove(propertyId: string, id: string): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        roomId: string | null;
        status: import("@prisma/client").$Enums.MealStatus;
        residentId: string;
        bookingId: string;
        deliveryBatchId: string | null;
        qrToken: string;
    }>;
}
export {};
