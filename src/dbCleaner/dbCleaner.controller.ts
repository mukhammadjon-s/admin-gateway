import { DbCleanDto } from './dto/dbCleaner.dto';
import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { DbCleanerInterface } from './interfaces/dbCleaner.interface';
import { GRPC_DB_CLEANER_PACKAGE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@Controller('dbClean')
export class DbCleanerController implements OnModuleInit {
  private dbCleanerService: DbCleanerInterface;

  constructor(@Inject(GRPC_DB_CLEANER_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.dbCleanerService =
      this.client.getService<DbCleanerInterface>('DbCleanerService');
  }

  @Delete('/removeAllData')
  @ApiResponse({ type: DbCleanDto })
  async deleteAll(): Promise<DbCleanDto> {
    // const response = await lastValueFrom(
    //   this.dbCleanerService.DbClean({}),
    // ).catch((r) => {
    //   throw new HttpException(
    //     {
    //       statusCode: HttpStatus.BAD_REQUEST,
    //       error: r.details || r.message,
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // });

    // return response;
    throw new HttpException(
      {
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
