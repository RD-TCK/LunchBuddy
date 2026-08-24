import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { TenantGuard } from "../auth/tenant.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "@mealflow/types";

@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Request() req,
  ) {
    return this.organizationsService.create(createOrganizationDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.organizationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.OWNER)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.organizationsService.remove(id);
  }
}
