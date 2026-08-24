import { PropertiesService } from "./properties.service";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    create(createPropertyDto: CreatePropertyDto, req: any): Promise<{
        name: string;
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        timezone: string | null;
    }>;
    findAll(req: any): Promise<{
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
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<{
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
