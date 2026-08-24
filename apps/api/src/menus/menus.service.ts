import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    const existingMenu = await this.prisma.menu.findUnique({
      where: {
        propertyId_date_type: {
          propertyId: createMenuDto.propertyId,
          date: new Date(createMenuDto.date),
          type: createMenuDto.type,
        },
      },
    });

    if (existingMenu) {
      throw new ConflictException('Menu already exists for this date and type');
    }

    return this.prisma.menu.create({
      data: {
        ...createMenuDto,
        date: new Date(createMenuDto.date),
      },
    });
  }

  findAll(propertyId: string) {
    return this.prisma.menu.findMany({
      where: { propertyId },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, propertyId: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id, propertyId },
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: string, propertyId: string, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id, propertyId); // Verify existence and tenant
    
    // Check for conflict if date/type is updated
    if (updateMenuDto.date || updateMenuDto.type) {
        const existingMenu = await this.prisma.menu.findFirst({
            where: {
                propertyId,
                date: updateMenuDto.date ? new Date(updateMenuDto.date) : undefined,
                type: updateMenuDto.type,
                id: { not: id }
            }
        });
        if (existingMenu) {
            throw new ConflictException('Another menu already exists for this date and type');
        }
    }

    const data: any = { ...updateMenuDto };
    if (data.date) {
        data.date = new Date(data.date);
    }

    return this.prisma.menu.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, propertyId: string) {
    await this.findOne(id, propertyId);
    return this.prisma.menu.delete({
      where: { id },
    });
  }
}
