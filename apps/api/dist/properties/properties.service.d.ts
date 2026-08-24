import { PrismaService } from "../prisma/prisma.service";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
export declare class PropertiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePropertyDto): Promise<{
        name: string;
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        timezone: string | null;
    }>;
    findAll(organizationId: string): Promise<{
        name: string;
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        timezone: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        timezone: string | null;
    }>;
    update(id: string, dto: UpdatePropertyDto): Promise<{
        name: string;
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        timezone: string | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
