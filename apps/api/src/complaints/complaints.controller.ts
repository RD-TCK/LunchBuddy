import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ComplaintsService,
  CreateComplaintDto,
  ResolveComplaintDto,
} from './complaints.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TenantGuard } from '../auth/tenant.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@mealflow/types';

@Controller('properties/:propertyId/complaints')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER, UserRole.RESIDENT)
  @Post()
  create(
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateComplaintDto,
  ) {
    if (dto.propertyId !== propertyId) {
      throw new ForbiddenException('Property ID mismatch');
    }
    return this.complaintsService.create(dto);
  }

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.KITCHEN_STAFF,
    UserRole.DELIVERY_STAFF,
  )
  @Get()
  findAll(@Param('propertyId') propertyId: string) {
    return this.complaintsService.findAll(propertyId);
  }

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.KITCHEN_STAFF,
    UserRole.DELIVERY_STAFF,
    UserRole.RESIDENT,
  )
  @Get(':id')
  findOne(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
  ) {
    return this.complaintsService.findOne(id, propertyId);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id/resolve')
  resolve(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
    @Body() dto: ResolveComplaintDto,
  ) {
    return this.complaintsService.resolve(id, propertyId, dto);
  }
}
