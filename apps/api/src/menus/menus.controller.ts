import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TenantGuard } from '../auth/tenant.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@mealflow/types';

@Controller('properties/:propertyId/menus')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(
    @Param('propertyId') propertyId: string,
    @Body() createMenuDto: CreateMenuDto,
  ) {
    if (createMenuDto.propertyId !== propertyId) {
      throw new ForbiddenException('Property ID mismatch');
    }
    return this.menusService.create(createMenuDto);
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
    return this.menusService.findAll(propertyId);
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
    return this.menusService.findOne(id, propertyId);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  update(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    if (updateMenuDto.propertyId && updateMenuDto.propertyId !== propertyId) {
       throw new ForbiddenException('Cannot change property ID');
    }
    return this.menusService.update(id, propertyId, updateMenuDto);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  remove(
    @Param('propertyId') propertyId: string,
    @Param('id') id: string,
  ) {
    return this.menusService.remove(id, propertyId);
  }
}
