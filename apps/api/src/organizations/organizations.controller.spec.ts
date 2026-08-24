import { Test, TestingModule } from "@nestjs/testing";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";
import { PrismaService } from "../prisma/prisma.service";
import { TenantGuard } from "../auth/tenant.guard";
import { UserRole } from "@mealflow/types";
import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

describe("OrganizationsController & TenantGuard", () => {
  let controller: OrganizationsController;
  let service: OrganizationsService;
  let guard: TenantGuard;

  const mockOrganizationsService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        { provide: OrganizationsService, useValue: mockOrganizationsService },
        { provide: PrismaService, useValue: mockPrismaService },
        TenantGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
    service = module.get<OrganizationsService>(OrganizationsService);
    guard = module.get<TenantGuard>(TenantGuard);
  });

  const createMockContext = (
    user: any,
    params: any = {},
    body: any = {},
    url = "/organizations",
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

  describe("TenantGuard Organization isolation checks", () => {
    it("should allow access if organizationId matches user organizationId", async () => {
      const user = { organizationId: "org-a", role: UserRole.OWNER };
      const context = createMockContext(
        user,
        { id: "org-a" },
        {},
        "/organizations/org-a",
      );
      const canActivate = await guard.canActivate(context as ExecutionContext);
      expect(canActivate).toBe(true);
    });

    it("should deny access if organizationId does not match user organizationId", async () => {
      const user = { organizationId: "org-a", role: UserRole.OWNER };
      const context = createMockContext(
        user,
        { id: "org-b" },
        {},
        "/organizations/org-b",
      );
      await expect(
        guard.canActivate(context as ExecutionContext),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("OrganizationsController Controller checks", () => {
    describe("create", () => {
      it("should create organization and associate with user", async () => {
        const req = { user: { id: "user-1" } };
        const dto = { name: "Test Org" };
        mockOrganizationsService.create.mockResolvedValue({
          id: "org-1",
          name: "Test Org",
        });

        const result = await controller.create(dto, req as any);
        expect(service.create).toHaveBeenCalledWith(dto, "user-1");
        expect(result.id).toBe("org-1");
      });
    });

    describe("findOne", () => {
      it("should return organization details", async () => {
        mockOrganizationsService.findOne.mockResolvedValue({
          id: "org-a",
          name: "Org A",
        });
        const result = await controller.findOne("org-a");
        expect(service.findOne).toHaveBeenCalledWith("org-a");
        expect(result.name).toBe("Org A");
      });
    });
  });
});
