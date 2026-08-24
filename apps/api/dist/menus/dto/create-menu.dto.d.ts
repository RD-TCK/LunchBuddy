import { MealType } from '@mealflow/types';
export declare class CreateMenuDto {
    propertyId: string;
    date: string;
    type: MealType;
    title: string;
    description?: string;
}
