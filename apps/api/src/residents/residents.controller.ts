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
  NotFoundException,
} from "@nestjs/common";
import { ResidentsService } from "./residents.service";
import { CreateResidentDto } from "./dto/create-resident.dto";
import { UpdateResidentDto } from "./dto/update-resident.dto";
import { ImportResidentsDto } from "./dto/import-residents.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { TenantGuard } from "../auth/tenant.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "@mealflow/types";
import { PrismaService } from "../prisma/prisma.service";

@Controller()
export class ResidentsController {
  constructor(
    private readonly residentsService: ResidentsService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Post("properties/:propertyId/residents")
  async create(
    @Param("propertyId") propertyId: string,
    @Body() createResidentDto: CreateResidentDto,
  ) {
    return this.residentsService.create(propertyId, createResidentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Get("properties/:propertyId/residents")
  async findAll(@Param("propertyId") propertyId: string) {
    return this.residentsService.findAll(propertyId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Post("properties/:propertyId/residents/import")
  async import(
    @Param("propertyId") propertyId: string,
    @Body() importResidentsDto: ImportResidentsDto,
  ) {
    return this.residentsService.importResidents(
      propertyId,
      importResidentsDto.residents,
    );
  }

  private async verifyResidentAccess(req: any, residentId: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
      include: { property: true },
    });

    if (!resident) {
      throw new NotFoundException("Resident not found");
    }

    if (
      req.user.organizationId &&
      resident.property.organizationId !== req.user.organizationId
    ) {
      throw new ForbiddenException("Cross-tenant access denied");
    }

    if (req.user.propertyId && resident.propertyId !== req.user.propertyId) {
      throw new ForbiddenException("Cross-property access denied");
    }

    return resident.propertyId;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Get("residents/:id")
  async findOne(@Param("id") id: string, @Request() req) {
    const propertyId = await this.verifyResidentAccess(req, id);
    return this.residentsService.findOne(propertyId, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Patch("residents/:id")
  async update(
    @Param("id") id: string,
    @Body() updateResidentDto: UpdateResidentDto,
    @Request() req,
  ) {
    const propertyId = await this.verifyResidentAccess(req, id);
    return this.residentsService.update(propertyId, id, updateResidentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Delete("residents/:id")
  async remove(@Param("id") id: string, @Request() req) {
    const propertyId = await this.verifyResidentAccess(req, id);
    return this.residentsService.remove(propertyId, id);
  }
}
