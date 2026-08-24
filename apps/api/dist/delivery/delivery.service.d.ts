import { PrismaService } from '../prisma/prisma.service';
import { MealType } from '@mealflow/types';
export declare class DeliveryService {
    private prisma;
    constructor(prisma: PrismaService);
    createBatch(propertyId: string, date: string, type: MealType, assignedToId: string, createdById: string): Promise<{
        mealsAssigned: number;
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DeliveryBatchStatus;
        date: Date;
        type: import("@prisma/client").$Enums.MealType;
        assignedToId: string | null;
    }>;
    findBatches(propertyId: string): import("@prisma/client").Prisma.PrismaPromise<({
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
                user: {
                    name: string;
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
        assignedTo: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.DeliveryBatchStatus;
        date: Date;
        type: import("@prisma/client").$Enums.MealType;
        assignedToId: string | null;
    })[]>;
    dispatchBatch(batchId: string, propertyId: string, userId: string): Promise<{
        batchId: string;
        dispatched: number;
    }>;
    scanAndDeliver(qrToken: string, propertyId: string, userId: string): Promise<{
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
}
