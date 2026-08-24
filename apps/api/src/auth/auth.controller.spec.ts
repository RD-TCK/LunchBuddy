import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "@mealflow/types";
import { UnauthorizedException } from "@nestjs/common";

const mockAuthService = {
  register: jest.fn(),
  validateUser: jest.fn(),
  login: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
};

describe("AuthController", () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {
    it("should always register as RESIDENT role", async () => {
      const dto: RegisterDto = {
        email: "test@example.com",
        password: "password123",
        name: "Test Resident",
        role: UserRole.OWNER, // Attacker attempts privilege escalation
      };

      mockAuthService.register.mockResolvedValue({
        id: "1",
        email: dto.email,
        role: "RESIDENT",
      });

      await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(
        dto.email,
        dto.password,
        dto.name,
        UserRole.RESIDENT, // Must be forced to RESIDENT
      );
    });
  });

  describe("registerStaff", () => {
    it("should register staff with specified role", async () => {
      const dto: RegisterDto = {
        email: "manager@example.com",
        password: "password123",
        name: "Test Manager",
        role: UserRole.MANAGER,
      };

      mockAuthService.register.mockResolvedValue({
        id: "2",
        email: dto.email,
        role: "MANAGER",
      });

      await controller.registerStaff(dto);

      expect(service.register).toHaveBeenCalledWith(
        dto.email,
        dto.password,
        dto.name,
        UserRole.MANAGER, // Retains specified role
      );
    });
  });

  describe("login", () => {
    it("should login and return tokens", async () => {
      const dto: LoginDto = {
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

      expect(service.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(service.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        accessToken: "access",
        refreshToken: "refresh",
      });
    });

    it("should throw UnauthorizedException on invalid credentials", async () => {
      const dto: LoginDto = {
        email: "test@example.com",
        password: "wrong-password",
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
