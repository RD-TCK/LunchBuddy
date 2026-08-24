import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { MealStatus } from '@mealflow/types';

export class UpdateMealDto {
  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @IsUUID()
  @IsOptional()
  bookingId?: string;

  @IsUUID()
  @IsOptional()
  residentId?: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsUUID()
  @IsOptional()
  deliveryBatchId?: string;

  @IsEnum(MealStatus)
  @IsOptional()
  status?: MealStatus;
}
