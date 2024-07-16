import { RegionModule } from './region/region.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DistrictModule } from './district/district.module';
import { AppLoggerMiddleware } from './middlewares/request-logging';
import { CompanyModule } from './company/company.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { VariantModule } from './variant/variant.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { DbCleanerModule } from './dbCleaner/dbCleaner.module';
import { UserAddressModule } from './users-address/user-address.module';
import { ExcelModule } from './excel/excel.module';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(),
    DistrictModule,
    RegionModule,
    CompanyModule,
    WarehouseModule,
    ProductModule,
    CategoryModule,
    BrandModule,
    UserModule,
    OrderModule,
    CartModule,
    VariantModule,
    DbCleanerModule,
    UserAddressModule,
    ExcelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
