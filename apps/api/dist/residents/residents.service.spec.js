"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const residents_service_1 = require("./residents.service");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const common_1 = require("@nestjs/common");
describe("ResidentsService", () => {
    let service;
    let prisma;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                residents_service_1.ResidentsService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        room: {
                            findUnique: jest.fn(),
                        },
                        resident: {
                            findUnique: jest.fn(),
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        $transaction: jest.fn((cb) => cb({
                            user: {
                                findUnique: jest.fn(),
                                create: jest.fn(),
                                update: jest.fn(),
                            },
                            resident: {
                                findUnique: jest.fn(),
                                create: jest.fn(),
                                update: jest.fn(),
                            },
                        })),
                    },
                },
                {
                    provide: users_service_1.UsersService,
                    useValue: {},
                },
            ],
        }).compile();
        service = module.get(residents_service_1.ResidentsService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("create resident", () => {
        it("should throw BadRequestException if room belongs to another property", async () => {
            jest
                .spyOn(prisma.room, "findUnique")
                .mockResolvedValue({ id: "room-1", propertyId: "prop-2" });
            await expect(service.create("prop-1", {
                name: "Test",
                email: "test@example.com",
                roomId: "room-1",
            })).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe("findOne", () => {
        it("should throw NotFoundException if resident not found for the given property", async () => {
            jest.spyOn(prisma.resident, "findFirst").mockResolvedValue(null);
            await expect(service.findOne("prop-1", "res-1")).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=residents.service.spec.js.map