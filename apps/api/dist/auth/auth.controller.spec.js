"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const types_1 = require("@mealflow/types");
const common_1 = require("@nestjs/common");
const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
};
describe("AuthController", () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [{ provide: auth_service_1.AuthService, useValue: mockAuthService }],
        }).compile();
        controller = module.get(auth_controller_1.AuthController);
        service = module.get(auth_service_1.AuthService);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
    describe("register", () => {
        it("should always register as RESIDENT role", async () => {
            const dto = {
                email: "test@example.com",
                password: "password123",
                name: "Test Resident",
                role: types_1.UserRole.OWNER,
            };
            mockAuthService.register.mockResolvedValue({
                id: "1",
                email: dto.email,
                role: "RESIDENT",
            });
            await controller.register(dto);
            expect(service.register).toHaveBeenCalledWith(dto.email, dto.password, dto.name, types_1.UserRole.RESIDENT);
        });
    });
    describe("registerStaff", () => {
        it("should register staff with specified role", async () => {
            const dto = {
                email: "manager@example.com",
                password: "password123",
                name: "Test Manager",
                role: types_1.UserRole.MANAGER,
            };
            mockAuthService.register.mockResolvedValue({
                id: "2",
                email: dto.email,
                role: "MANAGER",
            });
            await controller.registerStaff(dto);
            expect(service.register).toHaveBeenCalledWith(dto.email, dto.password, dto.name, types_1.UserRole.MANAGER);
        });
    });
    describe("login", () => {
        it("should login and return tokens", async () => {
            const dto = {
                email: "test@example.com",
                password: "password123",
            };
            const mockUser = { id: "1", email: "test@example.com", role: "RESIDENT" };
            mockAuthService.validateUser.mockResolvedValue(mockUser);
            mockAuthService.login.mockResolvedValue({
                accessToken: "access",
                refreshToken: "refresh",
            });
            const result = await controller.login(dto);
            expect(service.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
            expect(service.login).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual({
                accessToken: "access",
                refreshToken: "refresh",
            });
        });
        it("should throw UnauthorizedException on invalid credentials", async () => {
            const dto = {
                email: "test@example.com",
                password: "wrong-password",
            };
            mockAuthService.validateUser.mockResolvedValue(null);
            await expect(controller.login(dto)).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.controller.spec.js.map