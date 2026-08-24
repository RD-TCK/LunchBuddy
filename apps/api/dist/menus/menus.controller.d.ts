import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    create(propertyId: string, createMenuDto: CreateMenuDto): Promise<{
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
    findOne(propertyId: string, id: string): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        type: import("@prisma/client").$Enums.MealType;
        title: string;
        description: string | null;
    }>;
    update(propertyId: string, id: string, updateMenuDto: UpdateMenuDto): Promise<{
        id: string;
        propertyId: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        type: import("@prisma/client").$Enums.MealType;
        title: string;
        description: string | null;
    }>;
    remove(propertyId: string, id: string): Promise<{
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
