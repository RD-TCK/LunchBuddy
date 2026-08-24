import { IsString, IsEmail, IsOptional, IsEnum, IsUUID } from "class-validator";
import { MealPlan, ResidentStatus } from "@prisma/client";

export class CreateResidentDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  residentCode?: string;

  @IsEnum(MealPlan)
  @IsOptional()
  mealPlan?: MealPlan;

  @IsEnum(ResidentStatus)
  @IsOptional()
  status?: ResidentStatus;
}
