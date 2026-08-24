import { MealStatus } from '@mealflow/types';
export declare class UpdateMealDto {
    propertyId?: string;
    bookingId?: string;
    residentId?: string;
    roomId?: string;
    deliveryBatchId?: string;
    status?: MealStatus;
}
