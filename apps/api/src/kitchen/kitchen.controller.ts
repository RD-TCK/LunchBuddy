import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { KitchenService } from './kitchen.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TenantGuard } from '../auth/tenant.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@mealflow/types';
import { IsArray, IsUUID } from 'class-validator';

class BatchActionDto {
  @IsArray()
  @IsUUID('all', { each: true })
  mealIds: string[];
}

@Controller('properties/:propertyId/kitchen')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.KITCHEN_STAFF,
  )
  @Get('dashboard')
  getDashboard(
    @Param('propertyId') propertyId: string,
    @Query('date') date: string,
  ) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.kitchenService.getDashboard(propertyId, targetDate);
  }

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.KITCHEN_STAFF,
  )
  @Post('start-preparing')
  startPreparing(
    @Param('propertyId') propertyId: string,
    @Body() body: BatchActionDto,
    @Request() req,
  ) {
    return this.kitchenService.startPreparing(
      propertyId,
      body.mealIds,
      req.user.id,
    );
  }

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.KITCHEN_STAFF,
  )
  @Post('mark-packed')
  markPacked(
    @Param('propertyId') propertyId: string,
    @Body() body: BatchActionDto,
    @Request() req,
  ) {
    return this.kitchenService.markPacked(
      propertyId,
      body.mealIds,
      req.user.id,
    );
  }
}
