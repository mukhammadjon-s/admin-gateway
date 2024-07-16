import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderControllerInterface } from './interfaces/order.interface';
import { GRPC_ORDER_PACKAGE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { OrderCancellationDto, OrderDto, OrderGetAllResponse, OrderItemCancellationDto } from './dto/order.dto';
import { lastValueFrom } from 'rxjs';
import { GetAllDto } from './dto/get.all.dto';
import { GetOneDto } from './dto/get.one.dto';
import { LangEnum } from '../shared/enums/enum';
import { Metadata } from '@grpc/grpc-js';
import { AtAuthGuard } from '../shared/guards/at-auth.guard';
import { CurrentUser } from '../user/global/decorators/current-user.decorator';
import { RolesEnum } from '../user/enums';

@Controller('order')
@UseGuards(AtAuthGuard)
export class OrderController implements OnModuleInit {
  private shopService: OrderControllerInterface;

  constructor(@Inject(GRPC_ORDER_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.shopService =
      this.client.getService<OrderControllerInterface>('ShopService');
  }

  @Post('/getAll')
  @ApiResponse({ type: OrderGetAllResponse })
  async getAll(
    @Body() body: GetAllDto,
    @Headers('lang') lang: LangEnum,
    @CurrentUser() user: any
  ): Promise<OrderGetAllResponse> {
    const page = body.pagination.page || 1;
    const pagesize = body.pagination.pagesize || 100;

    if (user.role === RolesEnum.MERCHANT) {
      body = { ...body, filters: { companyId: user?.companyId }}
    }
    body = { ...body, pagination: { page: +page - 1 , pagesize}};
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.shopService.GetOrders(body, metadata),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'error',
          message: e.message,
        },
        HttpStatus.NOT_FOUND,
      );
    });

    if (response?.data) {
      response.data.forEach((order) => {
        order.createdAt = Number(order.createdAt);
        order.updatedAt = Number(order.updatedAt);
        order.minDeliveryDate = Number(order.minDeliveryDate);
        order.maxDeliveryDate = Number(order.maxDeliveryDate);
      });
    }


    return {
      meta: {
        totalCount: response.total,
        page: +page,
        limit: +body.pagination.pagesize,
      },
      results: response?.data || [],
    };
  }

  @Get('/getOne/:id')
  async getOne(
    @Param('id') id: string,
    @Body() body: GetOneDto,
    @Headers('lang') lang?: LangEnum,
  ): Promise<OrderDto> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    return lastValueFrom(
      this.shopService.GetOrder({ id, ...body }, metadata),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'error',
          message: e.message,
        },
        HttpStatus.NOT_FOUND,
      );
    });
  }

  @Post('/addNew')
  @ApiResponse({ type: [OrderDto] })
  async AddNew(
    @Body() body?: any,
    @Headers('lang') lang?: LangEnum,
  ): Promise<any> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    return lastValueFrom(this.shopService.AddNew(body)).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'error',
          message: e.message,
        },
        HttpStatus.NOT_FOUND,
      );
    });
  }

  @Post('orderCancellation')
  async orderCancellation(
    @Body() body: OrderCancellationDto,
    @CurrentUser() user: any,
  ) {
      body.user = user || {};
      return lastValueFrom(this.shopService.OrderCancellation(body))
  }

  @Post('orderItemCancellation')
  async orderItemCancellation(
    @Body() body: OrderItemCancellationDto,
    @CurrentUser() user: any,
  ) {
    body.user = user || {};
    return lastValueFrom(this.shopService.OrderItemCancellation(body))
  }

  @Patch('view-orders')
  @UseGuards(AtAuthGuard)
  async viewOrders(@Body() body: {ordersIds: number[]}) {
    try {
      return lastValueFrom(this.shopService.ViewOrders({ordersIds: body.ordersIds}));
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: error.details
      }, HttpStatus.BAD_REQUEST, {
        cause: error
      });
    }
  }

  @Get('new-orders')
  @UseGuards(AtAuthGuard)
  async newOrders(@CurrentUser() user){
    try {
      return lastValueFrom(this.shopService.NewOrders({userId: user.userId}))
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: error.details
      }, HttpStatus.BAD_REQUEST, {
        cause: error
      });
    }
  }
}
