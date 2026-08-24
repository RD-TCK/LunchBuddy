"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const mockUsersService = {
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
};
const mockJwtService = {
    sign: jest.fn().mockReturnValue("mock-token"),
    verify: jest.fn(),
};
describe("AuthService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: users_service_1.UsersService, useValue: mockUsersService },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("hashPassword", () => {
        it("should hash the password", async () => {
            const password = "my-password";
            const hash = await service.hashPassword(password);
            expect(hash).toBeDefined();
            expect(hash).not.toEqual(password);
            expect(await bcrypt.compare(password, hash)).toBe(true);
        });
    });
    describe("login", () => {
        it("should hash the refresh token and update database", async () => {
            const user = {
                id: "user-1",
                email: "test@example.com",
                name: "Test User",
                role: "RESIDENT",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockUsersService.update.mockResolvedValue({
                ...user,
                refreshTokenHash: "hashed-refresh-token",
            });
            const result = await service.login(user);
            expect(mockUsersService.update).toHaveBeenCalledWith(user.id, expect.objectContaining({
                refreshTokenHash: expect.any(String),
            }));
            const lastUpdateArgs = mockUsersService.update.mock.calls[mockUsersService.update.mock.calls.length - 1];
            const savedHash = lastUpdateArgs[1].refreshTokenHash;
            expect(await bcrypt.compare(result.refreshToken, savedHash)).toBe(true);
        });
    });
    describe("refresh", () => {
        it("should verify token, generate new tokens, and rotate refresh token hash in db", async () => {
            const refreshToken = "mock-refresh-token";
            const hashedToken = await bcrypt.hash(refreshToken, 10);
            const user = {
                id: "user-1",
                email: "test@example.com",
                name: "Test User",
                role: "RESIDENT",
                isActive: true,
                refreshTokenHash: hashedToken,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockJwtService.verify.mockReturnValue({ sub: "user-1" });
            mockUsersService.findOneById.mockResolvedValue(user);
            mockUsersService.update.mockResolvedValue(user);
            const result = await service.refresh(refreshToken);
            expect(mockUsersService.findOneById).toHaveBeenCalledWith("user-1");
            expect(mockUsersService.update).toHaveBeenCalledWith("user-1", expect.objectContaining({
                refreshTokenHash: expect.any(String),
            }));
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
            expect(result.refreshToken).not.toEqual(refreshToken);
        });
    });
    describe("logout", () => {
        it("should set refreshTokenHash to null", async () => {
            await service.logout("user-1");
            expect(mockUsersService.update).toHaveBeenCalledWith("user-1", {
                refreshTokenHash: null,
            });
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map