import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBookingDto: CreateBookingDto): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        menuId: string;
        residentId: string;
    }>;
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
    })[]>;
    findOne(id: string, propertyId: string): Promise<{
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
    }>;
    update(id: string, propertyId: string, updateBookingDto: UpdateBookingDto): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        menuId: string;
        residentId: string;
    }>;
    remove(id: string, propertyId: string): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        menuId: string;
        residentId: string;
    }>;
}
