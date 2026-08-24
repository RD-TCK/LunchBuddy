import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { PropertiesModule } from "./properties/properties.module";
import { ResidentsModule } from "./residents/residents.module";
import { RolesGuard } from "./auth/roles.guard";
import { MenusModule } from './menus/menus.module';
import { BookingsModule } from './bookings/bookings.module';
import { MealsModule } from './meals/meals.module';
import { KitchenModule } from './kitchen/kitchen.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ComplaintsModule } from './complaints/complaints.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    UsersModule,
    PrismaModule,
    OrganizationsModule,
    PropertiesModule,
    ResidentsModule,
    MenusModule,
    BookingsModule,
    MealsModule,
    KitchenModule,
    DeliveryModule,
    ComplaintsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
