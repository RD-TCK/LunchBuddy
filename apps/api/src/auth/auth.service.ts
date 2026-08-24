import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { User } from "@mealflow/database";
import { UserRole } from "@mealflow/types";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async register(
    email: string,
    password: string,
    name?: string,
    role?: UserRole,
  ): Promise<User> {
    const existing = await this.usersService.findOneByEmail(email);
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const passwordHash = await this.hashPassword(password);
    return this.usersService.create({
      email,
      passwordHash,
      name,
      role: role as any, // Structurally compatible with Prisma Role
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.isActive) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const result = { ...user };
        delete (result as any).passwordHash;
        delete (result as any).refreshTokenHash;
        return result;
      }
    }
    return null;
  }

  async login(user: Omit<User, "passwordHash" | "refreshTokenHash">) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId,
      propertyId: user.propertyId,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "15m",
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        expiresIn: "7d",
      },
    );

    // Save hashed refresh token to db
    const refreshTokenHash = await this.hashPassword(refreshToken);
    await this.usersService.update(user.id, { refreshTokenHash });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as unknown as UserRole,
        isActive: user.isActive,
        organizationId: user.organizationId,
        propertyId: user.propertyId,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOneById(payload.sub);

      if (!user || !user.refreshTokenHash || !user.isActive) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      // Verify the refresh token against the stored hash
      const isMatch = await bcrypt.compare(token, user.refreshTokenHash);
      if (!isMatch) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      // Generate new access token & new rotated refresh token
      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        organizationId: user.organizationId,
        propertyId: user.propertyId,
      };
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: "15m",
      });

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id },
        {
          expiresIn: "7d",
        },
      );

      const newRefreshTokenHash = await this.hashPassword(newRefreshToken);
      await this.usersService.update(user.id, {
        refreshTokenHash: newRefreshTokenHash,
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshTokenHash: null });
    return { success: true };
  }
}
