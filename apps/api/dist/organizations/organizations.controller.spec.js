"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const organizations_controller_1 = require("./organizations.controller");
const organizations_service_1 = require("./organizations.service");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_guard_1 = require("../auth/tenant.guard");
const types_1 = require("@mealflow/types");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
describe("OrganizationsController & TenantGuard", () => {
    let controller;
    let service;
    let guard;
    const mockOrganizationsService = {
        create: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };
    const mockPrismaService = {};
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [organizations_controller_1.OrganizationsController],
            providers: [
                { provide: organizations_service_1.OrganizationsService, useValue: mockOrganizationsService },
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
                tenant_guard_1.TenantGuard,
                core_1.Reflector,
            ],
        }).compile();
        controller = module.get(organizations_controller_1.OrganizationsController);
        service = module.get(organizations_service_1.OrganizationsService);
        guard = module.get(tenant_guard_1.TenantGuard);
    });
    const createMockContext = (user, params = {}, body = {}, url = "/organizations") => {
        const request = {
            user,
            params,
            body,
            url,
        };
        return {
            switchToHttp: () => ({
                getRequest: () => request,
                getResponse: jest.fn(),
                getNext: jest.fn(),
            }),
        };
    };
    describe("TenantGuard Organization isolation checks", () => {
        it("should allow access if organizationId matches user organizationId", async () => {
            const user = { organizationId: "org-a", role: types_1.UserRole.OWNER };
            const context = createMockContext(user, { id: "org-a" }, {}, "/organizations/org-a");
            const canActivate = await guard.canActivate(context);
            expect(canActivate).toBe(true);
        });
        it("should deny access if organizationId does not match user organizationId", async () => {
            const user = { organizationId: "org-a", role: types_1.UserRole.OWNER };
            const context = createMockContext(user, { id: "org-b" }, {}, "/organizations/org-b");
            await expect(guard.canActivate(context)).rejects.toThrow(common_1.ForbiddenException);
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
                const result = await controller.create(dto, req);
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
//# sourceMappingURL=organizations.controller.spec.js.map