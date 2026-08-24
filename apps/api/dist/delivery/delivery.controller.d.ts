import { DeliveryService } from './delivery.service';
import { MealType } from '@mealflow/types';
declare class CreateBatchDto {
    date: string;
    type: MealType;
    assignedToId: string;
}
declare class ScanDeliverDto {
    qrToken: string;
}
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    createBatch(propertyId: string, body: CreateBatchDto, req: any): Promise<{
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
    dispatchBatch(propertyId: string, batchId: string, req: any): Promise<{
        batchId: string;
        dispatched: number;
    }>;
    scanAndDeliver(propertyId: string, body: ScanDeliverDto, req: any): Promise<{
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
export {};
