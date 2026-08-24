"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_service_1 = require("./users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const mockPrismaService = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
};
describe("UsersService", () => {
    let service;
    let prisma;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("findOneByEmail", () => {
        it("should call prisma.user.findUnique", async () => {
            const email = "test@example.com";
            mockPrismaService.user.findUnique.mockResolvedValue({ id: "1", email });
            const result = await service.findOneByEmail(email);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
            expect(result).toEqual({ id: "1", email });
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map