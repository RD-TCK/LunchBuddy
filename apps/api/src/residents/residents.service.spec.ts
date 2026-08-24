import { Test, TestingModule } from "@nestjs/testing";
import { ResidentsService } from "./residents.service";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("ResidentsService", () => {
  let service: ResidentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResidentsService,
        {
          provide: PrismaService,
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
            $transaction: jest.fn((cb) =>
              cb({
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
              }),
            ),
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ResidentsService>(ResidentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create resident", () => {
    it("should throw BadRequestException if room belongs to another property", async () => {
      jest
        .spyOn(prisma.room, "findUnique")
        .mockResolvedValue({ id: "room-1", propertyId: "prop-2" } as any);

      await expect(
        service.create("prop-1", {
          name: "Test",
          email: "test@example.com",
          roomId: "room-1",
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("findOne", () => {
    it("should throw NotFoundException if resident not found for the given property", async () => {
      jest.spyOn(prisma.resident, "findFirst").mockResolvedValue(null);

      await expect(service.findOne("prop-1", "res-1")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
