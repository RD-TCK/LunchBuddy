import { UserRole } from "@mealflow/types";
export declare class RegisterDto {
    email: string;
    password: string;
    name?: string;
    role?: UserRole;
}
