import { MealStatus } from '@mealflow/types';
export declare class CreateMealDto {
    propertyId: string;
    bookingId: string;
    residentId: string;
    roomId?: string;
    status?: MealStatus;
    qrToken: string;
}
