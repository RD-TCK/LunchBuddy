import { KitchenService } from './kitchen.service';
declare class BatchActionDto {
    mealIds: string[];
}
export declare class KitchenController {
    private readonly kitchenService;
    constructor(kitchenService: KitchenService);
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
    startPreparing(propertyId: string, body: BatchActionDto, req: any): Promise<{
        updated: number;
        status: import("@mealflow/types").MealStatus;
    }>;
    markPacked(propertyId: string, body: BatchActionDto, req: any): Promise<{
        updated: number;
        status: import("@mealflow/types").MealStatus;
    }>;
}
export {};
