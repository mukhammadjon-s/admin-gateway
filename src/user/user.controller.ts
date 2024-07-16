import { UpdateUserAdminDto } from './dto/update.user.admin.dto';
import { GetAllUserDto, GetUserListDto } from './dto/getAll.dto';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GRPC_USER_PACKAGE } from './constants';
import { PasswordDto } from './dto/password.details.dto';
import { UserResgisterDto } from './dto/register.dto';
import { CurrentUserRt } from './global/decorators/current-user-rt.decorator';
import { CurrentUser } from './global/decorators/current-user.decorator';
import { AtAuthGuard } from './guards/at-auth.guard';
import { RtAuthGuard } from './guards/rt-auth.guard';
import { UsersControllerInterface } from './user.interface';
import { formatErrorMessage } from './utils';
import { DeleteUserDto } from './dto/delete.dto';
import { RolesEnum } from './enums';

@Controller('user')
export class UserController implements OnModuleInit {
  private usersService: UsersControllerInterface;

  constructor(@Inject(GRPC_USER_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersControllerInterface>('UserController');
  }

  @Get('/getAll')
  @UseGuards(AtAuthGuard)
  async GetAll(
    @Query() query?: GetAllUserDto,
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('pagesize', new DefaultValuePipe(100)) pagesize?: number,
    @Query('role', new DefaultValuePipe(100)) role?: RolesEnum,
  ): Promise<any> {
    query = { ...query, ...{ page: +page - 1 }, pagesize };
    const response = await lastValueFrom(this.usersService.GetAll(query)).catch(
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
    return {
      meta: {
        totalCount: response.total,
        page: +page,
        limit: +pagesize,
      },
      results: response.data || [],
    };
  }

  @Get('/getUsersList')
  @UseGuards(AtAuthGuard)
  async GetUserList(
    @Query() query?: GetUserListDto,
  ): Promise<any> {
    const page = query.page || 1;
    const pagesize = query.pagesize || 100;
    query = { ...query, ...{ page: +page - 1 }, pagesize };
    const response = await lastValueFrom(this.usersService.GetUsersList(query)).catch(
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
    return {
      meta: {
        totalCount: response.total,
        page: +page,
        limit: +pagesize,
      },
      results: response.users || [],
    };
  }

  @Put('update-user/:id')
  @UseGuards(AtAuthGuard)
  async updateUserAdmin(
    @Param('id') id: number,
    @Body() data: UpdateUserAdminDto,
  ): Promise<any> {
    return lastValueFrom(
      this.usersService.UpdateUserAdmin({ id, ...data }),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: e.details || e.message,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Delete('delete/:id')
  @UseGuards(AtAuthGuard)
  async delete(@Param() params:DeleteUserDto,@Param('id') id: number): Promise<any> {
    return lastValueFrom(this.usersService.DeleteUser({ id })).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error:"Not Found",
        },
        HttpStatus.NOT_FOUND,
      );
    });
  }

  // @Post('forget-password')
  async forgetPassword(@Body('msisdn') msisdn: string): Promise<any> {
    return lastValueFrom(this.usersService.ForgetPassword({ msisdn })).catch(
      (e) => {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: e.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    );
  }

  // @Put('change-password')
  @UseGuards(AtAuthGuard)
  async changePassword(
    @Body('msisdn') msisdn: string,
    @Body('code') code: string,
    @Body() passwordDto: PasswordDto,
  ) {
    return lastValueFrom(
      this.usersService.ChangePassword({
        msisdn: msisdn,
        code: code,
        password: passwordDto,
      }),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Post('logout')
  @UseGuards(AtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logoutUser(@CurrentUser() user: any): Promise<any> {
    return lastValueFrom(this.usersService.LogoutUser({ user })).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Put('add-password')
  @UseGuards(AtAuthGuard)
  async addPassword(
    @CurrentUser() user: any,
    @Body() passwordDto: PasswordDto,
  ): Promise<void> {
    return lastValueFrom(
      this.usersService.AddPassword({ user: user, password: passwordDto }),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Post('refresh')
  @UseGuards(RtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @CurrentUser() user: any,
    @CurrentUserRt('refreshToken') rt: string,
  ) {
    return lastValueFrom(
      this.usersService.RefreshTokens({ user: user, refreshToken: rt }),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Get(':userId')
  @UseGuards(AtAuthGuard)
  async getUserById(@Param('userId') userId: number): Promise<any> {
    return lastValueFrom(this.usersService.GetUserById({ userId })).catch(
      (e) => {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: e.message,
          },
          HttpStatus.NOT_FOUND,
        );
      },
    );
  }

  @Post('assign/role')
  @UseGuards(AtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async assignRole(@Body() data: any): Promise<any> {
    return lastValueFrom(this.usersService.AssignRole({ role: data })).catch(
      (e) => {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: e.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    );
  }

  @Put('user-status')
  @UseGuards(AtAuthGuard)
  async updateStatus(@Body() data: any): Promise<any> {
    return lastValueFrom(this.usersService.UpdateStatus({ user: data })).catch(
      (e) => {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: e.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    );
  }

  @Post('login/password')
  @HttpCode(HttpStatus.OK)
  async loginWithPassword(@Body() data: any): Promise<any> {
    return lastValueFrom(
      this.usersService.LoginWithPassword({
        login: data.email,
        password: data.password,
      }),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: e.stack,
          message: e.details
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Post('register')
  async register(@Body() data: UserResgisterDto): Promise<any> {
    const response = await lastValueFrom(
      this.usersService.Register({ user: data }),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: formatErrorMessage(e.message),
        },
        HttpStatus.BAD_REQUEST,
      );
    });

    delete response.user.password;
    delete response.user.language;

    return response;
  }

  @Post('merchant/register')
  async registerMerchant(@Body() data: any): Promise<any> {
    return lastValueFrom(this.usersService.Register({ user: data })).catch(
      (e) => {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: e.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    );
  }
}
