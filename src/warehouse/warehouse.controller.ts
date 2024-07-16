/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get, HttpException, HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  Query, UseGuards,
} from '@nestjs/common';
import { WarehouseInterface } from "./interfaces/warehouse.interface";
import { GRPC_WAREHOUSE_PACKAGE } from "./constants";
import { ClientGrpc } from "@nestjs/microservices";
import { ApiResponse } from "@nestjs/swagger";
import { WarehouseDto, WarehouseGetAllResponse } from "./dto/warehouse.dto";
import { lastValueFrom } from "rxjs";
import { GetAllDto } from "./dto/get.all.dto";
import { GetOneDto } from "./dto/get.one.dto";
import { WarehouseStatus } from "../shared/enums/enum";
import { AtAuthGuard } from '../shared/guards/at-auth.guard';
import { CurrentUser } from '../shared/global/decorators/current-user.decorator';
import { ValidateMerchantCompany } from '../shared/global/decorators/validate-merchant-company.decorator';
import { RolesEnum } from '../user/enums';

@Controller("warehouse")
@UseGuards(AtAuthGuard)
export class WarehouseController implements OnModuleInit {
  private warehouseService: WarehouseInterface;

  constructor(@Inject(GRPC_WAREHOUSE_PACKAGE) private client: ClientGrpc) {
  }

  onModuleInit() {
    this.warehouseService =
      this.client.getService<WarehouseInterface>("WarehouseService");
  }

  @Get("/getAll")
  @ApiResponse({ type: WarehouseGetAllResponse })
  async getAll(
    @CurrentUser() user: any,
    @Query() query?: GetAllDto,
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('pagesize', new DefaultValuePipe(100)) pagesize?: number,
  ): Promise<WarehouseGetAllResponse> {
    query = { ...query, ...{ page: +page - 1 }, pagesize };
    if (user.role === RolesEnum.MERCHANT) query.companyId = user.companyId
    const response = await lastValueFrom(this.warehouseService.GetAll({ query }))
      .catch(r => {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          error: "error",
          message: r.message
        }, HttpStatus.NOT_FOUND);
      });

    return {
      meta: {
        totalCount: response.total,
        page: +page,
        limit: +query.pagesize,
      },
      results: response.data || [],
    };
  }

  @Get("/getOne/:id")
  async getOne(@Param() param?: GetOneDto): Promise<WarehouseDto> {
    return lastValueFrom(this.warehouseService.GetOne({ id: param.id }))
      .catch(r => {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          error: "error",
          message: "Not found this id"
        }, HttpStatus.NOT_FOUND);
      });
  }

  @Post("/addNew")
  @ApiResponse({ type: WarehouseDto })
  async AddNew(
    @ValidateMerchantCompany() validateFlag: boolean,
    @Body() body: WarehouseDto): Promise<any> {
    return lastValueFrom(
      this.warehouseService.AddNew({
        warehouse: body
      })
    )
    .catch(r => {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "error",
        message: 'Something went wrong',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  @Put("/update/:id")
  @ApiResponse({ type: WarehouseDto })
  async Update(
    @Param("id") id: number,
    @Body() body: WarehouseDto,
    @ValidateMerchantCompany() validateFlag: boolean
  ): Promise<any> {
    return lastValueFrom(this.warehouseService.Update({ id, warehouse: body }))
      .catch(r => {
        throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "error",
          message: r.message,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  @Delete("/delete/:id")
  @ApiResponse({})
  async Delete(@Param("id") id: number): Promise<any> {
    return lastValueFrom(this.warehouseService.Delete({ id }))
      .catch(r => {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          error: "error",
          message: r.message
        }, HttpStatus.NOT_FOUND);
      });
  }
}
