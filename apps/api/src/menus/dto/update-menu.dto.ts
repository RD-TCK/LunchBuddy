import { IsString, IsEnum, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { MealType } from '@mealflow/types';

export class UpdateMenuDto {
  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsEnum(MealType)
  @IsOptional()
  type?: MealType;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
