import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId: string;
}
