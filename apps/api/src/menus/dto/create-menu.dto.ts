import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { MealType } from '@mealflow/types';

export class CreateMenuDto {
  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(MealType)
  @IsNotEmpty()
  type: MealType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
