import { Test, TestingModule } from "@nestjs/testing";
import { RolesGuard } from "./roles.guard";
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
import { UserRole } from "@mealflow/types";

describe("RolesGuard", () => {
  let guard: RolesGuard;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, { provide: Reflector, useValue: mockReflector }],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  const createMockContext = (userRole?: string): Partial<ExecutionContext> => {
    const request = {
      user: userRole ? { role: userRole } : undefined,
    };
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () =>
        ({
          getRequest: () => request,
          getResponse: jest.fn(),
          getNext: jest.fn(),
        }) as any,
    };
  };

  it("should return true if no roles are required", () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);
    const context = createMockContext();
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it("should return true if user has required role", () => {
    mockReflector.getAllAndOverride.mockReturnValue([
      UserRole.ADMIN,
      UserRole.OWNER,
    ]);
    const context = createMockContext("ADMIN");
    expect(guard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it("should return false if user does not have required role", () => {
    mockReflector.getAllAndOverride.mockReturnValue([
      UserRole.ADMIN,
      UserRole.OWNER,
    ]);
    const context = createMockContext("RESIDENT");
    expect(guard.canActivate(context as ExecutionContext)).toBe(false);
  });

  it("should return false if request has no user", () => {
    mockReflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
    const context = createMockContext();
    expect(guard.canActivate(context as ExecutionContext)).toBe(false);
  });
});
