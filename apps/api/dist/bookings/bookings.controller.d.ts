import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(propertyId: string, createBookingDto: CreateBookingDto): Promise<{
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
    findOne(propertyId: string, id: string): Promise<{
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
    update(propertyId: string, id: string, updateBookingDto: UpdateBookingDto): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        menuId: string;
        residentId: string;
    }>;
    remove(propertyId: string, id: string): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        menuId: string;
        residentId: string;
    }>;
}
