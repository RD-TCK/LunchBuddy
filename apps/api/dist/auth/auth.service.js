"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
    async register(email, password, name, role) {
        const existing = await this.usersService.findOneByEmail(email);
        if (existing) {
            throw new common_1.ConflictException("Email already registered");
        }
        const passwordHash = await this.hashPassword(password);
        return this.usersService.create({
            email,
            passwordHash,
            name,
            role: role,
        });
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.isActive) {
            const isMatch = await bcrypt.compare(pass, user.passwordHash);
            if (isMatch) {
                const result = { ...user };
                delete result.passwordHash;
                delete result.refreshTokenHash;
                return result;
            }
        }
        return null;
    }
    async login(user) {
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
        const refreshToken = this.jwtService.sign({ sub: user.id }, {
            expiresIn: "7d",
        });
        const refreshTokenHash = await this.hashPassword(refreshToken);
        await this.usersService.update(user.id, { refreshTokenHash });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isActive: user.isActive,
                organizationId: user.organizationId,
                propertyId: user.propertyId,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            },
        };
    }
    async refresh(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findOneById(payload.sub);
            if (!user || !user.refreshTokenHash || !user.isActive) {
                throw new common_1.UnauthorizedException("Invalid refresh token");
            }
            const isMatch = await bcrypt.compare(token, user.refreshTokenHash);
            if (!isMatch) {
                throw new common_1.UnauthorizedException("Invalid refresh token");
            }
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
            const newRefreshToken = this.jwtService.sign({ sub: user.id }, {
                expiresIn: "7d",
            });
            const newRefreshTokenHash = await this.hashPassword(newRefreshToken);
            await this.usersService.update(user.id, {
                refreshTokenHash: newRefreshTokenHash,
            });
            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (e) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
    }
    async logout(userId) {
        await this.usersService.update(userId, { refreshTokenHash: null });
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map