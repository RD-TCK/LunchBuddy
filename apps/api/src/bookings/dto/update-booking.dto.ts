import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '@mealflow/types';

export class UpdateBookingDto {
  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @IsUUID()
  @IsOptional()
  menuId?: string;

  @IsUUID()
  @IsOptional()
  residentId?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
