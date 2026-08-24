import { PrismaService } from '../prisma/prisma.service';
import { ComplaintStatus } from '@mealflow/types';
import { ComplaintType } from '@mealflow/types';
export declare class CreateComplaintDto {
    propertyId: string;
    mealId: string;
    residentId: string;
    type: ComplaintType;
    description: string;
}
export declare class ResolveComplaintDto {
    resolutionNotes?: string;
    assignedToId?: string;
    status?: ComplaintStatus;
}
export declare class ComplaintsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateComplaintDto): import("@prisma/client").Prisma.Prisma__ComplaintClient<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ComplaintStatus;
        type: import("@prisma/client").$Enums.ComplaintType;
        description: string;
        residentId: string;
        mealId: string;
        assignedToId: string | null;
        resolutionNotes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(propertyId: string): import("@prisma/client").Prisma.PrismaPromise<({
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
        meal: {
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
        };
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
        status: import("@prisma/client").$Enums.ComplaintStatus;
        type: import("@prisma/client").$Enums.ComplaintType;
        description: string;
        residentId: string;
        mealId: string;
        assignedToId: string | null;
        resolutionNotes: string | null;
    })[]>;
    findOne(id: string, propertyId: string): Promise<{
        resident: {
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
        meal: {
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
            events: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.MealStatus;
                userId: string | null;
                mealId: string;
                notes: string | null;
            }[];
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
        };
        assignedTo: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ComplaintStatus;
        type: import("@prisma/client").$Enums.ComplaintType;
        description: string;
        residentId: string;
        mealId: string;
        assignedToId: string | null;
        resolutionNotes: string | null;
    }>;
    resolve(id: string, propertyId: string, dto: ResolveComplaintDto): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ComplaintStatus;
        type: import("@prisma/client").$Enums.ComplaintType;
        description: string;
        residentId: string;
        mealId: string;
        assignedToId: string | null;
        resolutionNotes: string | null;
    }>;
}
