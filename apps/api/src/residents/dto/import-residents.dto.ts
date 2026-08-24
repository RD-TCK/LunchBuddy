import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateResidentDto } from "./create-resident.dto";

export class ImportResidentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResidentDto)
  residents: CreateResidentDto[];
}
