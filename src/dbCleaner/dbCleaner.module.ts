import { Module } from '@nestjs/common';
import { DbCleanerController } from './dbCleaner.controller';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GRPC_DB_CLEANER_PACKAGE } from './constants';
import { productMsUrl } from 'src/shared/constants/msUrls';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: GRPC_DB_CLEANER_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(
            process.cwd(),
            'node_modules/@padishah/toolbox/grpc/product.proto',
          ),
          url: productMsUrl,
          loader: {
            objects: true,
          },
        },
      },
    ]),
  ],
  controllers: [DbCleanerController],
  providers: [],
})
export class DbCleanerModule {}
