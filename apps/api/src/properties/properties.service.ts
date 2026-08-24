import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePropertyDto) {
    const org = await this.prisma.organization.findUnique({
      where: { id: dto.organizationId },
    });

    if (!org) {
      throw new NotFoundException("Organization not found");
    }

    return this.prisma.property.create({
      data: dto,
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.property.findMany({
      where: { organizationId },
    });
  }

  async findOne(id: string) {
    const prop = await this.prisma.property.findUnique({
      where: { id },
    });
    if (!prop) {
      throw new NotFoundException("Property not found");
    }
    return prop;
  }

  async update(id: string, dto: UpdatePropertyDto) {
    const prop = await this.findOne(id);
    return this.prisma.property.update({
      where: { id: prop.id },
      data: dto,
    });
  }

  async remove(id: string) {
    const prop = await this.findOne(id);
    await this.prisma.property.delete({
      where: { id: prop.id },
    });
    return { success: true };
  }
}
