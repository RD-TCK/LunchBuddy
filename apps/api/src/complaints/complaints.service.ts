import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ComplaintStatus } from '@mealflow/types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ComplaintType } from '@mealflow/types';

export class CreateComplaintDto {
  @IsUUID()
  @IsNotEmpty()
  propertyId: string;

  @IsUUID()
  @IsNotEmpty()
  mealId: string;

  @IsUUID()
  @IsNotEmpty()
  residentId: string;

  @IsEnum(ComplaintType)
  @IsNotEmpty()
  type: ComplaintType;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class ResolveComplaintDto {
  @IsString()
  @IsOptional()
  resolutionNotes?: string;

  @IsUUID()
  @IsOptional()
  assignedToId?: string;

  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus;
}

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateComplaintDto) {
    return this.prisma.complaint.create({
      data: dto,
    });
  }

  findAll(propertyId: string) {
    return this.prisma.complaint.findMany({
      where: { propertyId },
      include: {
        meal: { include: { booking: { include: { menu: true } } } },
        resident: { include: { user: { select: { name: true, email: true } } } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, propertyId: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id, propertyId },
      include: {
        meal: { include: { booking: { include: { menu: true } }, events: true } },
        resident: { include: { user: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
    if (!complaint) throw new NotFoundException('Complaint not found');
    return complaint;
  }

  async resolve(id: string, propertyId: string, dto: ResolveComplaintDto) {
    await this.findOne(id, propertyId);
    return this.prisma.complaint.update({
      where: { id },
      data: {
        resolutionNotes: dto.resolutionNotes,
        assignedToId: dto.assignedToId,
        status: dto.status ?? ComplaintStatus.RESOLVED,
      },
    });
  }
}
