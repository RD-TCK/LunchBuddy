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
  ForbiddenException,
} from "@nestjs/common";
import { PropertiesService } from "./properties.service";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { TenantGuard } from "../auth/tenant.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "@mealflow/types";

@Controller("properties")
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Post()
  async create(@Body() createPropertyDto: CreatePropertyDto, @Request() req) {
    // Validate that owner/admin belongs to the target organization
    if (
      req.user.organizationId &&
      req.user.organizationId !== createPropertyDto.organizationId
    ) {
      throw new ForbiddenException(
        "Cannot create properties for another organization",
      );
    }
    return this.propertiesService.create(createPropertyDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.KITCHEN_STAFF,
    UserRole.DELIVERY_STAFF,
    UserRole.RESIDENT,
  )
  @Get()
  async findAll(@Request() req) {
    if (!req.user.organizationId) {
      throw new ForbiddenException(
        "You must belong to an organization to list properties",
      );
    }

    if (req.user.propertyId) {
      // Scoped user can only list their own assigned property
      const prop = await this.propertiesService.findOne(req.user.propertyId);
      return [prop];
    }

    return this.propertiesService.findAll(req.user.organizationId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.KITCHEN_STAFF,
    UserRole.DELIVERY_STAFF,
    UserRole.RESIDENT,
  )
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.propertiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.OWNER)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.propertiesService.remove(id);
  }
}
