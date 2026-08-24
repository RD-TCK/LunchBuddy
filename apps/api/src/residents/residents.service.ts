import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateResidentDto } from "./dto/create-resident.dto";
import { UpdateResidentDto } from "./dto/update-resident.dto";
import { UserRole } from "@mealflow/types";
import * as bcrypt from "bcrypt";

@Injectable()
export class ResidentsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(propertyId: string, dto: CreateResidentDto) {
    if (dto.roomId) {
      const room = await this.prisma.room.findUnique({
        where: { id: dto.roomId },
      });
      if (!room || room.propertyId !== propertyId) {
        throw new BadRequestException("Room does not belong to this property");
      }
    }

    return this.prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        const hashedPassword = await bcrypt.hash("resident123", 10);
        user = await tx.user.create({
          data: {
            email: dto.email,
            name: dto.name,
            passwordHash: hashedPassword,
            role: UserRole.RESIDENT,
            propertyId: propertyId,
          },
        });
      } else {
        const existingResident = await tx.resident.findUnique({
          where: { userId: user.id },
        });
        if (existingResident) {
          throw new ConflictException("User is already a resident");
        }
      }

      return tx.resident.create({
        data: {
          userId: user.id,
          propertyId,
          roomId: dto.roomId,
          residentCode: dto.residentCode,
          mealPlan: dto.mealPlan || "STANDARD",
          status: dto.status || "ACTIVE",
        },
        include: { user: true, room: true },
      });
    });
  }

  async findAll(propertyId: string) {
    return this.prisma.resident.findMany({
      where: { propertyId },
      include: { user: true, room: true },
    });
  }

  async findOne(propertyId: string, id: string) {
    const resident = await this.prisma.resident.findFirst({
      where: { id, propertyId },
      include: { user: true, room: true },
    });

    if (!resident) {
      throw new NotFoundException("Resident not found in this property");
    }

    return resident;
  }

  async update(propertyId: string, id: string, dto: UpdateResidentDto) {
    const resident = await this.findOne(propertyId, id);

    if (dto.roomId) {
      const room = await this.prisma.room.findUnique({
        where: { id: dto.roomId },
      });
      if (!room || room.propertyId !== propertyId) {
        throw new BadRequestException("Room does not belong to this property");
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.name || dto.email || dto.phone) {
        await tx.user.update({
          where: { id: resident.userId },
          data: {
            name: dto.name,
            email: dto.email,
          },
        });
      }

      return tx.resident.update({
        where: { id },
        data: {
          roomId: dto.roomId,
          residentCode: dto.residentCode,
          mealPlan: dto.mealPlan,
          status: dto.status,
          leftAt: dto.status === "INACTIVE" ? new Date() : null,
        },
        include: { user: true, room: true },
      });
    });
  }

  async remove(propertyId: string, id: string) {
    const resident = await this.findOne(propertyId, id);

    await this.prisma.resident.delete({
      where: { id: resident.id },
    });
    return { success: true };
  }

  async importResidents(propertyId: string, residents: CreateResidentDto[]) {
    const results = { successful: 0, failed: 0, errors: [] };

    for (const resDto of residents) {
      try {
        await this.create(propertyId, resDto);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({ email: resDto.email, error: error.message });
      }
    }

    return results;
  }
}
