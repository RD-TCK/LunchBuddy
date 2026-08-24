"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const roles_guard_1 = require("./roles.guard");
const core_1 = require("@nestjs/core");
const types_1 = require("@mealflow/types");
describe("RolesGuard", () => {
    let guard;
    const mockReflector = {
        getAllAndOverride: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [roles_guard_1.RolesGuard, { provide: core_1.Reflector, useValue: mockReflector }],
        }).compile();
        guard = module.get(roles_guard_1.RolesGuard);
    });
    it("should be defined", () => {
        expect(guard).toBeDefined();
    });
    const createMockContext = (userRole) => {
        const request = {
            user: userRole ? { role: userRole } : undefined,
        };
        return {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: () => ({
                getRequest: () => request,
                getResponse: jest.fn(),
                getNext: jest.fn(),
            }),
        };
    };
    it("should return true if no roles are required", () => {
        mockReflector.getAllAndOverride.mockReturnValue(undefined);
        const context = createMockContext();
        expect(guard.canActivate(context)).toBe(true);
    });
    it("should return true if user has required role", () => {
        mockReflector.getAllAndOverride.mockReturnValue([
            types_1.UserRole.ADMIN,
            types_1.UserRole.OWNER,
        ]);
        const context = createMockContext("ADMIN");
        expect(guard.canActivate(context)).toBe(true);
    });
    it("should return false if user does not have required role", () => {
        mockReflector.getAllAndOverride.mockReturnValue([
            types_1.UserRole.ADMIN,
            types_1.UserRole.OWNER,
        ]);
        const context = createMockContext("RESIDENT");
        expect(guard.canActivate(context)).toBe(false);
    });
    it("should return false if request has no user", () => {
        mockReflector.getAllAndOverride.mockReturnValue([types_1.UserRole.ADMIN]);
        const context = createMockContext();
        expect(guard.canActivate(context)).toBe(false);
    });
});
//# sourceMappingURL=roles.guard.spec.js.map