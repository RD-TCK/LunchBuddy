import { Module } from "@nestjs/common";
import { ResidentsService } from "./residents.service";
import { ResidentsController } from "./residents.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ResidentsController],
  providers: [ResidentsService],
})
export class ResidentsModule {}
