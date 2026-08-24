"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const properties_controller_1 = require("./properties.controller");
const properties_service_1 = require("./properties.service");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_guard_1 = require("../auth/tenant.guard");
const types_1 = require("@mealflow/types");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
describe("PropertiesController & TenantGuard", () => {
    let controller;
    let service;
    let guard;
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
        const module = await testing_1.Test.createTestingModule({
            controllers: [properties_controller_1.PropertiesController],
            providers: [
                { provide: properties_service_1.PropertiesService, useValue: mockPropertiesService },
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
                tenant_guard_1.TenantGuard,
                core_1.Reflector,
            ],
        }).compile();
        controller = module.get(properties_controller_1.PropertiesController);
        service = module.get(properties_service_1.PropertiesService);
        guard = module.get(tenant_guard_1.TenantGuard);
    });
    const createMockContext = (user, params = {}, body = {}, url = "/properties") => {
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
    describe("TenantGuard Isolation checks", () => {
        it("should allow access if property organizationId matches user organizationId", async () => {
            const user = { organizationId: "org-a", role: types_1.UserRole.OWNER };
            const property = { id: "prop-a", organizationId: "org-a" };
            mockPrismaService.property.findUnique.mockResolvedValue(property);
            const context = createMockContext(user, { id: "prop-a" }, {}, "/properties/prop-a");
            const canActivate = await guard.canActivate(context);
            expect(canActivate).toBe(true);
        });
        it("should deny access if property organizationId does not match user organizationId", async () => {
            const user = { organizationId: "org-a", role: types_1.UserRole.OWNER };
            const property = { id: "prop-b", organizationId: "org-b" };
            mockPrismaService.property.findUnique.mockResolvedValue(property);
            const context = createMockContext(user, { id: "prop-b" }, {}, "/properties/prop-b");
            await expect(guard.canActivate(context)).rejects.toThrow(common_1.ForbiddenException);
        });
        it("should deny access if user has a scoped propertyId and tries to access another property in same org", async () => {
            const user = {
                organizationId: "org-a",
                propertyId: "prop-a1",
                role: types_1.UserRole.MANAGER,
            };
            const property = { id: "prop-a2", organizationId: "org-a" };
            mockPrismaService.property.findUnique.mockResolvedValue(property);
            const context = createMockContext(user, { id: "prop-a2" }, {}, "/properties/prop-a2");
            await expect(guard.canActivate(context)).rejects.toThrow(common_1.ForbiddenException);
        });
        it("should allow access if user has scoped propertyId and tries to access that same property", async () => {
            const user = {
                organizationId: "org-a",
                propertyId: "prop-a1",
                role: types_1.UserRole.MANAGER,
            };
            const property = { id: "prop-a1", organizationId: "org-a" };
            mockPrismaService.property.findUnique.mockResolvedValue(property);
            const context = createMockContext(user, { id: "prop-a1" }, {}, "/properties/prop-a1");
            const canActivate = await guard.canActivate(context);
            expect(canActivate).toBe(true);
        });
        it("should throw NotFoundException if property does not exist", async () => {
            const user = { organizationId: "org-a", role: types_1.UserRole.OWNER };
            mockPrismaService.property.findUnique.mockResolvedValue(null);
            const context = createMockContext(user, { id: "prop-none" }, {}, "/properties/prop-none");
            await expect(guard.canActivate(context)).rejects.toThrow(common_1.NotFoundException);
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
                const result = await controller.findAll(req);
                expect(service.findAll).toHaveBeenCalledWith("org-a");
                expect(result).toHaveLength(2);
            });
            it("should return only the scoped property if user has propertyId scope", async () => {
                const req = {
                    user: { organizationId: "org-a", propertyId: "prop-a1" },
                };
                mockPropertiesService.findOne.mockResolvedValue({ id: "prop-a1" });
                const result = await controller.findAll(req);
                expect(service.findOne).toHaveBeenCalledWith("prop-a1");
                expect(result).toEqual([{ id: "prop-a1" }]);
            });
        });
        describe("create", () => {
            it("should throw ForbiddenException if user tries to create property for another org", async () => {
                const req = { user: { organizationId: "org-a", role: types_1.UserRole.OWNER } };
                const dto = { name: "New Prop", organizationId: "org-b" };
                await expect(controller.create(dto, req)).rejects.toThrow(common_1.ForbiddenException);
            });
            it("should create property if org matches user organizationId", async () => {
                const req = { user: { organizationId: "org-a", role: types_1.UserRole.OWNER } };
                const dto = { name: "New Prop", organizationId: "org-a" };
                mockPropertiesService.create.mockResolvedValue({
                    id: "new-prop",
                    ...dto,
                });
                const result = await controller.create(dto, req);
                expect(service.create).toHaveBeenCalledWith(dto);
                expect(result.id).toBe("new-prop");
            });
        });
    });
});
//# sourceMappingURL=properties.controller.spec.js.map