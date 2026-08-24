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
exports.ComplaintsService = exports.ResolveComplaintDto = exports.CreateComplaintDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const types_1 = require("@mealflow/types");
const class_validator_1 = require("class-validator");
const types_2 = require("@mealflow/types");
class CreateComplaintDto {
}
exports.CreateComplaintDto = CreateComplaintDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplaintDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplaintDto.prototype, "mealId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplaintDto.prototype, "residentId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(types_2.ComplaintType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplaintDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplaintDto.prototype, "description", void 0);
class ResolveComplaintDto {
}
exports.ResolveComplaintDto = ResolveComplaintDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveComplaintDto.prototype, "resolutionNotes", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveComplaintDto.prototype, "assignedToId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(types_1.ComplaintStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveComplaintDto.prototype, "status", void 0);
let ComplaintsService = class ComplaintsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        return this.prisma.complaint.create({
            data: dto,
        });
    }
    findAll(propertyId) {
        return this.prisma.complaint.findMany({
            where: { propertyId },
            include: {
                meal: { include: { booking: { include: { menu: true } } } },
                resident: { include: { user: { select: { name: true, email: true } } } },
                assignedTo: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, propertyId) {
        const complaint = await this.prisma.complaint.findUnique({
            where: { id, propertyId },
            include: {
                meal: { include: { booking: { include: { menu: true } }, events: true } },
                resident: { include: { user: true } },
                assignedTo: { select: { id: true, name: true } },
            },
        });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        return complaint;
    }
    async resolve(id, propertyId, dto) {
        await this.findOne(id, propertyId);
        return this.prisma.complaint.update({
            where: { id },
            data: {
                resolutionNotes: dto.resolutionNotes,
                assignedToId: dto.assignedToId,
                status: dto.status ?? types_1.ComplaintStatus.RESOLVED,
            },
        });
    }
};
exports.ComplaintsService = ComplaintsService;
exports.ComplaintsService = ComplaintsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplaintsService);
//# sourceMappingURL=complaints.service.js.map