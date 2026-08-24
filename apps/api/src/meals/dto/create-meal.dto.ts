import { IsUUID, IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { MealStatus } from '@mealflow/types';

export class CreateMealDto {
  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @IsUUID()
  @IsNotEmpty()
  bookingId: string;

  @IsUUID()
  @IsNotEmpty()
  residentId: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsEnum(MealStatus)
  @IsOptional()
  status?: MealStatus;

  @IsString()
  @IsNotEmpty()
  qrToken: string;
}
