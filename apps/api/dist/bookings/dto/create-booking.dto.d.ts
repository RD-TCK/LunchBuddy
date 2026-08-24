import { BookingStatus } from '@mealflow/types';
export declare class CreateBookingDto {
    propertyId: string;
    menuId: string;
    residentId: string;
    status?: BookingStatus;
}
