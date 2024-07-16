import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Query, UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GRPC_USER_PACKAGE } from './constants';
import { ClientControllerInterface } from './user.interface';
import { AtAuthGuard } from './guards/at-auth.guard';

@Controller('clients')
@UseGuards(AtAuthGuard)
export class ClientController implements OnModuleInit {
  private clientService: ClientControllerInterface;

  constructor(@Inject(GRPC_USER_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<ClientControllerInterface>('ClientController');
  }

  @Get('/')
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<any> {
    return await lastValueFrom(this.clientService.list({ page, limit })).catch(
      (e) => {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: e.details || e.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    );
  }
}
