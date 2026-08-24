import { Test, TestingModule } from "@nestjs/testing";
import { ResidentsController } from "./residents.controller";
import { ResidentsService } from "./residents.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

describe("ResidentsController", () => {
  let controller: ResidentsController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResidentsController],
      providers: [
        {
          provide: ResidentsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            importResidents: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            resident: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<ResidentsController>(ResidentsController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe("verifyResidentAccess", () => {
    it("should throw NotFoundException if resident not found", async () => {
      jest.spyOn(prisma.resident, "findUnique").mockResolvedValue(null);
      await expect(
        (controller as any).verifyResidentAccess({}, "res-1"),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException if user orgId does not match resident property orgId", async () => {
      jest.spyOn(prisma.resident, "findUnique").mockResolvedValue({
        id: "res-1",
        propertyId: "prop-1",
        property: { organizationId: "org-1" },
      } as any);

      const req = { user: { organizationId: "org-2" } };
      await expect(
        (controller as any).verifyResidentAccess(req, "res-1"),
      ).rejects.toThrow("Cross-tenant access denied");
    });

    it("should throw ForbiddenException if user propertyId does not match resident propertyId", async () => {
      jest.spyOn(prisma.resident, "findUnique").mockResolvedValue({
        id: "res-1",
        propertyId: "prop-1",
        property: { organizationId: "org-1" },
      } as any);

      const req = { user: { propertyId: "prop-2" } };
      await expect(
        (controller as any).verifyResidentAccess(req, "res-1"),
      ).rejects.toThrow("Cross-property access denied");
    });

    it("should return propertyId if access is valid", async () => {
      jest.spyOn(prisma.resident, "findUnique").mockResolvedValue({
        id: "res-1",
        propertyId: "prop-1",
        property: { organizationId: "org-1" },
      } as any);

      const req = { user: { organizationId: "org-1", propertyId: "prop-1" } };
      const res = await (controller as any).verifyResidentAccess(req, "res-1");
      expect(res).toBe("prop-1");
    });
  });
});
