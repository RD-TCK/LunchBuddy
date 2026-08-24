import { Test, TestingModule } from "@nestjs/testing";
import { PropertiesController } from "./properties.controller";
import { PropertiesService } from "./properties.service";
import { PrismaService } from "../prisma/prisma.service";
import { TenantGuard } from "../auth/tenant.guard";
import { UserRole } from "@mealflow/types";
import {
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

describe("PropertiesController & TenantGuard", () => {
  let controller: PropertiesController;
  let service: PropertiesService;
  let guard: TenantGuard;

  const mockPropertiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPrismaService = {
    property: {
      findUnique: jest.fn(),
    },
    organization: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        { provide: PropertiesService, useValue: mockPropertiesService },
        { provide: PrismaService, useValue: mockPrismaService },
        TenantGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    service = module.get<PropertiesService>(PropertiesService);
    guard = module.get<TenantGuard>(TenantGuard);
  });

  const createMockContext = (
    user: any,
    params: any = {},
    body: any = {},
    url = "/properties",
  ): Partial<ExecutionContext> => {
    const request = {
      user,
      params,
      body,
      url,
    };
    return {
      switchToHttp: () =>
        ({
          getRequest: () => request,
          getResponse: jest.fn(),
          getNext: jest.fn(),
        }) as any,
    };
  };

  describe("TenantGuard Isolation checks", () => {
    it("should allow access if property organizationId matches user organizationId", async () => {
      const user = { organizationId: "org-a", role: UserRole.OWNER };
      const property = { id: "prop-a", organizationId: "org-a" };
      mockPrismaService.property.findUnique.mockResolvedValue(property);

      const context = createMockContext(
        user,
        { id: "prop-a" },
        {},
        "/properties/prop-a",
      );
      const canActivate = await guard.canActivate(context as ExecutionContext);
      expect(canActivate).toBe(true);
    });

    it("should deny access if property organizationId does not match user organizationId", async () => {
      const user = { organizationId: "org-a", role: UserRole.OWNER };
      const property = { id: "prop-b", organizationId: "org-b" };
      mockPrismaService.property.findUnique.mockResolvedValue(property);

      const context = createMockContext(
        user,
        { id: "prop-b" },
        {},
        "/properties/prop-b",
      );
      await expect(
        guard.canActivate(context as ExecutionContext),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should deny access if user has a scoped propertyId and tries to access another property in same org", async () => {
      const user = {
        organizationId: "org-a",
        propertyId: "prop-a1",
        role: UserRole.MANAGER,
      };
      const property = { id: "prop-a2", organizationId: "org-a" };
      mockPrismaService.property.findUnique.mockResolvedValue(property);

      const context = createMockContext(
        user,
        { id: "prop-a2" },
        {},
        "/properties/prop-a2",
      );
      await expect(
        guard.canActivate(context as ExecutionContext),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should allow access if user has scoped propertyId and tries to access that same property", async () => {
      const user = {
        organizationId: "org-a",
        propertyId: "prop-a1",
        role: UserRole.MANAGER,
      };
      const property = { id: "prop-a1", organizationId: "org-a" };
      mockPrismaService.property.findUnique.mockResolvedValue(property);

      const context = createMockContext(
        user,
        { id: "prop-a1" },
        {},
        "/properties/prop-a1",
      );
      const canActivate = await guard.canActivate(context as ExecutionContext);
      expect(canActivate).toBe(true);
    });

    it("should throw NotFoundException if property does not exist", async () => {
      const user = { organizationId: "org-a", role: UserRole.OWNER };
      mockPrismaService.property.findUnique.mockResolvedValue(null);

      const context = createMockContext(
        user,
        { id: "prop-none" },
        {},
        "/properties/prop-none",
      );
      await expect(
        guard.canActivate(context as ExecutionContext),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("PropertiesController Controller checks", () => {
    describe("findAll", () => {
      it("should return all properties for organization if user has no scoped propertyId", async () => {
        const req = { user: { organizationId: "org-a" } };
        mockPropertiesService.findAll.mockResolvedValue([
          { id: "prop-a1" },
          { id: "prop-a2" },
        ]);

        const result = await controller.findAll(req as any);
        expect(service.findAll).toHaveBeenCalledWith("org-a");
        expect(result).toHaveLength(2);
      });

      it("should return only the scoped property if user has propertyId scope", async () => {
        const req = {
          user: { organizationId: "org-a", propertyId: "prop-a1" },
        };
        mockPropertiesService.findOne.mockResolvedValue({ id: "prop-a1" });

        const result = await controller.findAll(req as any);
        expect(service.findOne).toHaveBeenCalledWith("prop-a1");
        expect(result).toEqual([{ id: "prop-a1" }]);
      });
    });

    describe("create", () => {
      it("should throw ForbiddenException if user tries to create property for another org", async () => {
        const req = { user: { organizationId: "org-a", role: UserRole.OWNER } };
        const dto = { name: "New Prop", organizationId: "org-b" };

        await expect(controller.create(dto as any, req as any)).rejects.toThrow(
          ForbiddenException,
        );
      });

      it("should create property if org matches user organizationId", async () => {
        const req = { user: { organizationId: "org-a", role: UserRole.OWNER } };
        const dto = { name: "New Prop", organizationId: "org-a" };
        mockPropertiesService.create.mockResolvedValue({
          id: "new-prop",
          ...dto,
        });

        const result = await controller.create(dto as any, req as any);
        expect(service.create).toHaveBeenCalledWith(dto);
        expect(result.id).toBe("new-prop");
      });
    });
  });
});
