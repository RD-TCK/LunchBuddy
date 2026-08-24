import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TenantGuard } from '../auth/tenant.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, MealType } from '@mealflow/types';
import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';

class CreateBatchDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(MealType)
  @IsNotEmpty()
  type: MealType;

  @IsUUID()
  @IsNotEmpty()
  assignedToId: string;
}

class ScanDeliverDto {
  @IsString()
  @IsNotEmpty()
  qrToken: string;
}

@Controller('properties/:propertyId/delivery')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Post('batches')
  createBatch(
    @Param('propertyId') propertyId: string,
    @Body() body: CreateBatchDto,
    @Request() req,
  ) {
    return this.deliveryService.createBatch(
      propertyId,
      body.date,
      body.type,
      body.assignedToId,
      req.user.id,
    );
  }

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DELIVERY_STAFF,
  )
  @Get('batches')
  findBatches(@Param('propertyId') propertyId: string) {
    return this.deliveryService.findBatches(propertyId);
  }

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DELIVERY_STAFF,
  )
  @Post('batches/:batchId/dispatch')
  dispatchBatch(
    @Param('propertyId') propertyId: string,
    @Param('batchId') batchId: string,
    @Request() req,
  ) {
    return this.deliveryService.dispatchBatch(batchId, propertyId, req.user.id);
  }

  @Roles(
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DELIVERY_STAFF,
  )
  @Post('scan')
  scanAndDeliver(
    @Param('propertyId') propertyId: string,
    @Body() body: ScanDeliverDto,
    @Request() req,
  ) {
    return this.deliveryService.scanAndDeliver(
      body.qrToken,
      propertyId,
      req.user.id,
    );
  }
}
