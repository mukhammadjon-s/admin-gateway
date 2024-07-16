import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  Query, UseGuards,
} from '@nestjs/common';
import { CategoryControllerInterface } from './interfaces/category.interface';
import { GRPC_PRODUCT_PACKAGE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { BrandDto, BrandGetAllResponse } from './dto/brand.dto';
import { lastValueFrom } from 'rxjs';
import { GetAllDto } from './dto/get.all.dto';
import { GetOneDto } from './dto/get.one.dto';
import { LangEnum } from '../shared/enums/enum';
import { Metadata } from '@grpc/grpc-js';
import { jsonToStructProto, structProtoToJson } from '../shared/utils';
import { AtAuthGuard } from '../user/guards/at-auth.guard';

@Controller('brand')
@UseGuards(AtAuthGuard)
export class BrandController implements OnModuleInit {
  private branService: CategoryControllerInterface;

  constructor(@Inject(GRPC_PRODUCT_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.branService =
      this.client.getService<CategoryControllerInterface>('BrandService');
  }

  @Get('/getAll')
  @ApiResponse({ type: BrandGetAllResponse })
  async getAll(
    @Body() body: GetAllDto,
    @Query() query: any,
    @Headers('lang') lang: LangEnum,
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('pagesize', new DefaultValuePipe(100)) pagesize?: number,
  ): Promise<BrandGetAllResponse> {
    query = { ...query, ...{ page: +page - 1 }, pagesize };
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.branService.GetAll({ ...query, ...body }, metadata),
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
    return {
      meta: {
        totalCount: response.total,
        page: +page,
        limit: +query.pagesize,
      },
      results: response.data || [],
    };
  }

  @Get('/getOne/:id')
  async getOne(
    @Param('id') id: string,
    @Body() body: GetOneDto,
    @Headers('lang') lang?: LangEnum,
  ): Promise<{ data: BrandDto }> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.branService.GetOne({ id, ...body }, metadata),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: e.code ? e.details : e.message,
        },
        HttpStatus.NOT_FOUND,
      );
    });
    return {
      data: {
        ...response.data,
        translation: structProtoToJson(response.data?.translation),
      },
    };
  }

  @Post('/addNew')
  @ApiResponse({ type: [BrandDto] })
  async AddNew(
    @Body() body?: any,
    @Headers('lang') lang?: LangEnum,
  ): Promise<any> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const oldTranslation = body.translation;
    body.translation = jsonToStructProto(body.translation);
    const response = await lastValueFrom(
      this.branService.AddNew(
        {
          data: body,
        },
        metadata,
      ),
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

    return {
      data: {
        ...response.data,
        translation: oldTranslation,
      },
    };
  }

  @Put('/update/:id')
  @ApiResponse({ type: BrandDto })
  async Update(
    @Param('id') id: number,
    @Body() body: any,
    @Headers('lang') lang?: LangEnum,
  ): Promise<any> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const oldTranslation = body.translation;
    body.translation = jsonToStructProto(body.translation);
    const response = await lastValueFrom(
      this.branService.Update(
        {
          id,
          data: body,
        },
        metadata,
      ),
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

    return {
      data: {
        ...response.data,
        translation: oldTranslation,
      },
    };
    // return lastValueFrom(this.branService.Update({ id, data: body })).catch(
    //   (e) => {
    //     throw new HttpException(
    //       {
    //         statusCode: HttpStatus.NOT_FOUND,
    //         error: 'error',
    //         message: e.message,
    //       },
    //       HttpStatus.NOT_FOUND,
    //     );
    //   },
    // );
  }

  @Delete('/delete/:id')
  @ApiResponse({})
  async Delete(@Param('id') id: number): Promise<any> {
    return lastValueFrom(this.branService.Delete({ id })).catch((r) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'error',
          message: r.message,
        },
        HttpStatus.NOT_FOUND,
      );
    });
  }
}
