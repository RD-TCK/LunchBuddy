"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const residents_controller_1 = require("./residents.controller");
const residents_service_1 = require("./residents.service");
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
describe("ResidentsController", () => {
    let controller;
    let prisma;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [residents_controller_1.ResidentsController],
            providers: [
                {
                    provide: residents_service_1.ResidentsService,
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
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        resident: {
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();
        controller = module.get(residents_controller_1.ResidentsController);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    describe("verifyResidentAccess", () => {
        it("should throw NotFoundException if resident not found", async () => {
            jest.spyOn(prisma.resident, "findUnique").mockResolvedValue(null);
            await expect(controller.verifyResidentAccess({}, "res-1")).rejects.toThrow(common_1.NotFoundException);
        });
        it("should throw ForbiddenException if user orgId does not match resident property orgId", async () => {
            jest.spyOn(prisma.resident, "findUnique").mockResolvedValue({
                id: "res-1",
                propertyId: "prop-1",
                property: { organizationId: "org-1" },
            });
            const req = { user: { organizationId: "org-2" } };
            await expect(controller.verifyResidentAccess(req, "res-1")).rejects.toThrow("Cross-tenant access denied");
        });
        it("should throw ForbiddenException if user propertyId does not match resident propertyId", async () => {
            jest.spyOn(prisma.resident, "findUnique").mockResolvedValue({
                id: "res-1",
                propertyId: "prop-1",
                property: { organizationId: "org-1" },
            });
            const req = { user: { propertyId: "prop-2" } };
            await expect(controller.verifyResidentAccess(req, "res-1")).rejects.toThrow("Cross-property access denied");
        });
        it("should return propertyId if access is valid", async () => {
            jest.spyOn(prisma.resident, "findUnique").mockResolvedValue({
                id: "res-1",
                propertyId: "prop-1",
                property: { organizationId: "org-1" },
            });
            const req = { user: { organizationId: "org-1", propertyId: "prop-1" } };
            const res = await controller.verifyResidentAccess(req, "res-1");
            expect(res).toBe("prop-1");
        });
    });
});
//# sourceMappingURL=residents.controller.spec.js.map