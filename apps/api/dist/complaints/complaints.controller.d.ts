import { ComplaintsService, CreateComplaintDto, ResolveComplaintDto } from './complaints.service';
export declare class ComplaintsController {
    private readonly complaintsService;
    constructor(complaintsService: ComplaintsService);
    create(propertyId: string, dto: CreateComplaintDto): import("@prisma/client").Prisma.Prisma__ComplaintClient<{
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
    findOne(propertyId: string, id: string): Promise<{
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
    resolve(propertyId: string, id: string, dto: ResolveComplaintDto): Promise<{
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
