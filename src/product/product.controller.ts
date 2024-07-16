import { formatErrorMessage } from './../user/utils/index';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
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
import { ProductControllerInterface } from './interfaces/product.interface';
import { GRPC_PRODUCT_PACKAGE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { ProductDto, ProductGetAllResponse } from './dto/product.dto';
import { lastValueFrom } from 'rxjs';
import { GetAllDto } from './dto/get.all.dto';
import { GetOneDto } from './dto/get.one.dto';
import { LangEnum } from '../shared/enums/enum';
import { Metadata } from '@grpc/grpc-js';
import { structProtoToJson, translationMapper } from '../shared/utils';
import * as _ from 'lodash';
import { ProductAddDto } from './dto/register.dto';
import { AtAuthGuard } from '../user/guards/at-auth.guard';
import { ValidateMerchantCompany } from '../shared/global/decorators/validate-merchant-company.decorator';

@Controller('product')
// @UseGuards(AtAuthGuard)
export class ProductController implements OnModuleInit {
  private productService: ProductControllerInterface;

  constructor(@Inject(GRPC_PRODUCT_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductControllerInterface>('ProductService');
  }

  // @Get('/getAll')
  @ApiResponse({ type: ProductGetAllResponse })
  async getAll(
    @Query() query: any,
    @Body() body: GetAllDto,
    @Headers('lang') lang: LangEnum,
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('pagesize', new DefaultValuePipe(100)) pagesize?: number,
  ): Promise<ProductGetAllResponse> {
    query = { ...query, ...{ page: +page - 1 }, pagesize };
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.productService.GetAll({ ...query, ...body }, metadata),
    ).catch((r) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: r.details || r.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
    return {
      meta: {
        totalCount: response.total,
        page: query.page,
        limit: query.pagesize,
      },
      results:
        response.data?.map((r) => {
          return {
            ...r,
            variantFields: _.values(structProtoToJson(r.variantFields)),
          };
        }) || [],
    };
  }

  @Get('/getOne/:id')
  async getOne(
    @Param('id') id: string,
    @Body() body: GetOneDto,
    @Headers('lang') lang?: LangEnum,
  ): Promise<{ data: ProductDto }> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const data = await lastValueFrom(
      this.productService.GetOne({ id, ...body }, metadata),
    ).catch((r) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: r.details || r.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
    const product = data?.data;

    return {
      data: {
        ...product,
        variants: product?.variants?.map((variant) => {
          const doesNotHaveTranslation = !variant.values.translation?.ru;
          if (doesNotHaveTranslation)
            variant.values.translation = { uz: [], ru: [], en: [] };

          return variant;
        }),
      },
    };
  }

  @Post('/addNew')
  async AddNew(
    @ValidateMerchantCompany() validateFlag: boolean,
    @Body() body: ProductAddDto,
    @Headers('lang') lang?: LangEnum,
  ): Promise<any> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);

    const oldTranslation = body.translation;
    const product = {
      ...body,
      ...translationMapper(body),
      productType: 'manual',
    };

    const response = await lastValueFrom(
      this.productService.Create(product, metadata),
    ).catch((r) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: formatErrorMessage(
            r.details === 'No item found'
              ? 'Not found brand using brandId'
              : r.details || r.message,
          ),
        },
        HttpStatus.BAD_REQUEST,
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
  @ApiResponse({ type: ProductDto })
  async Update(
    @ValidateMerchantCompany() validateFlag: boolean,
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<any> {
    const response = await lastValueFrom(
      this.productService.Update({ id, ...body, ...translationMapper(body) }),
    ).catch((r) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: r.details || r.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
    return {
      data: {
        ...response.data,
        translation: structProtoToJson(response.data?.translation),
      },
    };
  }

  @Delete('/delete/:id')
  @ApiResponse({})
  async Delete(@Param('id') id: string): Promise<any> {
    return lastValueFrom(this.productService.Delete({ id })).catch((r) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: r.details || r.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }
}
