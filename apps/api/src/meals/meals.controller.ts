import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TenantGuard } from '../auth/tenant.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, MealStatus } from '@mealflow/types';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

class GenerateMealsDto {
  @IsUUID()
  @IsNotEmpty()
  menuId: string;
}

class UpdateStatusDto {
  @IsEnum(MealStatus)
  @IsNotEmpty()
  status: MealStatus;
}

@Controller('properties/:propertyId/meals')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  /** Trigger meal generation from a menu's bookings */
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Post('generate')
  generate(
    @Param('propertyId') propertyId: string,
    @Body() dto: GenerateMealsDto,
    @Request() req,
  ) {
    return this.mealsService.generateFromMenu(dto.menuId, propertyId, req.user.id);
  }

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.KITCHEN_STAFF,
    UserRole.DELIVERY_STAFF,
    UserRole.RESIDENT,
  )
  @Get()
  findAll(@Param('propertyId') propertyId: string) {
    return this.mealsService.findAll(propertyId);
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
    return this.mealsService.findOne(id, propertyId);
  }

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.KITCHEN_STAFF,
    UserRole.DELIVERY_STAFF,
  )
  @Patch(':id/status')
  updateStatus(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Request() req,
  ) {
    return this.mealsService.updateStatus(id, propertyId, dto.status, req.user.id);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
  ) {
    return this.mealsService.remove(id, propertyId);
  }
}
