import { userMsUrl } from '../shared/constants/msUrls';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GRPC_USER_PACKAGE } from './constants';
import { UserAddressController } from './user-address.controller';
import { AtStrategy } from 'src/shared/strategies';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({}),
    ClientsModule.register([
      {
        name: GRPC_USER_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(
            process.cwd(),
            'node_modules/@padishah/toolbox/grpc/user.proto',
          ),
          url: userMsUrl,
          loader: {
            objects: true,
          },
        },
      },
    ]),
  ],
  controllers: [UserAddressController],
  providers: [AtStrategy],
})
export class UserAddressModule {}
