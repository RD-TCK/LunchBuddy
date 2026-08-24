import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class MenusService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createMenuDto: CreateMenuDto): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        type: import("@prisma/client").$Enums.MealType;
        title: string;
        description: string | null;
    }>;
    findAll(propertyId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        type: import("@prisma/client").$Enums.MealType;
        title: string;
        description: string | null;
    }[]>;
    findOne(id: string, propertyId: string): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        type: import("@prisma/client").$Enums.MealType;
        title: string;
        description: string | null;
    }>;
    update(id: string, propertyId: string, updateMenuDto: UpdateMenuDto): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        type: import("@prisma/client").$Enums.MealType;
        title: string;
        description: string | null;
    }>;
    remove(id: string, propertyId: string): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        type: import("@prisma/client").$Enums.MealType;
        title: string;
        description: string | null;
    }>;
}
