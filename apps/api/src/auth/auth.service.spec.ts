import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

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
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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

      const result = await service.login(user as any);

      expect(mockUsersService.update).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({
          refreshTokenHash: expect.any(String),
        }),
      );

      // Verify stored token is hashed version of returned token
      const lastUpdateArgs =
        mockUsersService.update.mock.calls[
          mockUsersService.update.mock.calls.length - 1
        ];
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
      expect(mockUsersService.update).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({
          refreshTokenHash: expect.any(String),
        }),
      );

      // Verification of token rotation returned new tokens
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
