import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("Creator user not found");
    }

    if (user.organizationId) {
      throw new ConflictException(
        "User is already associated with an organization",
      );
    }

    // Wrap in a transaction to create organization and associate owner
    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: dto.name,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          organizationId: org.id,
        },
      });

      return org;
    });
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
    });
    if (!org) {
      throw new NotFoundException("Organization not found");
    }
    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    const org = await this.findOne(id);
    return this.prisma.organization.update({
      where: { id: org.id },
      data: dto,
    });
  }

  async remove(id: string) {
    const org = await this.findOne(id);
    await this.prisma.organization.delete({
      where: { id: org.id },
    });
    return { success: true };
  }
}
