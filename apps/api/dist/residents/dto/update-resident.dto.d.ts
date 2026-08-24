import { MealPlan, ResidentStatus } from "@prisma/client";
export declare class UpdateResidentDto {
    name?: string;
    email?: string;
    phone?: string;
    roomId?: string;
    residentCode?: string;
    mealPlan?: MealPlan;
    status?: ResidentStatus;
}
