import { IsUUID, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '@mealflow/types';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @IsUUID()
  @IsNotEmpty()
  menuId: string;

  @IsUUID()
  @IsNotEmpty()
  residentId: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
