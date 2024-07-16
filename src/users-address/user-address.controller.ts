import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { CurrentUser } from '../shared/global/decorators/current-user.decorator';
import { AtAuthGuard } from 'src/shared/guards/at-auth.guard';
import { GRPC_USER_PACKAGE } from './constants';
import {
  UserAddressCommonDto,
  UserAddressCreateDto,
  UserAddressCreateResponseDto,
  UserAddressDeleteResponseDto,
  UserAddressGetAllResponseDto,
  UserAddressUpdateResponseDto,
} from './dto/user-address.dto';
import { UserAddressControllerInterface } from './user-address.interface';

@Controller('user-address')
@UseGuards(AtAuthGuard)
export class UserAddressController implements OnModuleInit {
  private addressService: UserAddressControllerInterface;

  constructor(@Inject(GRPC_USER_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.addressService =
      this.client.getService<UserAddressControllerInterface>(
        'AddressController',
      );
    console.log(this.addressService);
  }

  @Post()
  @ApiResponse({ type: UserAddressCreateResponseDto })
  async create(
    @CurrentUser() user: any,
    @Body() body?: UserAddressCreateDto,
  ): Promise<UserAddressCreateResponseDto> {
    return lastValueFrom(
      this.addressService.Create({ ...body, userId: user.userId }),
    );
  }

  @Put(':id')
  @ApiResponse({ type: UserAddressUpdateResponseDto })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: number,
    @Body() body?: UserAddressCommonDto,
  ): Promise<UserAddressUpdateResponseDto> {
    const data = {
      ...body,
      id: +id,
      userId: user.userId,
    };
    return lastValueFrom(this.addressService.Update(data));
  }

  @Delete(':id')
  @ApiResponse({ type: UserAddressDeleteResponseDto })
  async delete(
    @CurrentUser() user: any,
    @Param('id') id: number,
  ): Promise<UserAddressDeleteResponseDto> {
    return lastValueFrom(
      this.addressService.Delete({ id: +id, userId: user.userId }),
    );
  }

  @Get()
  @ApiResponse({ type: UserAddressGetAllResponseDto })
  async getAll(
    @CurrentUser() user: any,
  ): Promise<UserAddressGetAllResponseDto> {
    return lastValueFrom(this.addressService.GetAll({ userId: user.userId }));
  }
}
