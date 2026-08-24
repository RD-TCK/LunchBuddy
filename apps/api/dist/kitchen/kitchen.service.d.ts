import { PrismaService } from '../prisma/prisma.service';
import { MealStatus } from '@mealflow/types';
export declare class KitchenService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(propertyId: string, date: string): Promise<{
        date: string;
        total: number;
        byStatus: Record<string, number>;
        meals: ({
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
        })[];
    }>;
    startPreparing(propertyId: string, mealIds: string[], userId: string): Promise<{
        updated: number;
        status: MealStatus;
    }>;
    markPacked(propertyId: string, mealIds: string[], userId: string): Promise<{
        updated: number;
        status: MealStatus;
    }>;
}
