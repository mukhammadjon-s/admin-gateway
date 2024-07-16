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
  Query,
  UseGuards,
} from '@nestjs/common';
import { VariantInterface } from './interfaces/variant.interface';
import { GRPC_PRODUCT_PACKAGE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { UnpublishedGroupsDto, UpdateQuantityDto, VariantDto, VariantGetAllResponse } from './dto/variant.dto';
import { lastValueFrom } from 'rxjs';
import { GetAllDto, GetAllVariantsDto } from './dto/get.all.dto';
import { GetOneDto } from './dto/get.one.dto';
import { LangEnum } from '../shared/enums/enum';
import { Metadata } from '@grpc/grpc-js';
import { getQuery } from '../shared/utils';
import { AtAuthGuard } from '../shared/guards/at-auth.guard';
import { CurrentUser } from '../shared/global/decorators/current-user.decorator';
import { PublishDto } from './dto/publish.dto';

@Controller('variant')
@UseGuards(AtAuthGuard)
export class VariantController implements OnModuleInit {
  // TODO: We should use types from '@padishah/toolbox/grpc/ts/product'
  private variantService: VariantInterface;

  constructor(@Inject(GRPC_PRODUCT_PACKAGE) private client: ClientGrpc) { }

  onModuleInit() {
    this.variantService =
      this.client.getService<VariantInterface>('VariantService');
  }
  // SetVariantGroupImages
  @Get('/groups')
  async productVariantGroups(@Query('productId') productId?: string) {
    if (productId) {
      try {
        const { data } = await lastValueFrom(
          this.variantService.GetVariantGroups({ productId }),
        );
        return { results: data };
      } catch (error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'error',
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'error',
        message: `'productId' required: .../groups?productId=id`,
      },
      HttpStatus.NOT_FOUND,
    );
  }


  @Get('/unpublishedGroups')
  async unpublishedGroups(
    @CurrentUser() user: any,
    @Query() query: UnpublishedGroupsDto,
    @Headers('lang') lang: LangEnum
  ) {
    try {
      const metadata = new Metadata();
      metadata.add('lang', `${lang}`);
      return await lastValueFrom(this.variantService.UnpublishedGroups({ ...query, companyId: user?.companyId }, metadata));
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: error.details
      }, HttpStatus.BAD_REQUEST, {
        cause: error
      });
    }
  }

  @Put('/groups/:groupId')
  async setVariantGroupImages(
    @Param('groupId') groupId: string,
    @Body('photos') photos: string[],
    @Body('sku') sku: string,
  ) {
    try {
      let photosValue = photos?.length === 0 ? [''] : photos;
      const { data } = await lastValueFrom(
        this.variantService.SetVariantGroupImages({
          groupId,
          photos: photosValue,
          sku,
        }),
      );
      return { data };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'error',
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  //Deprecated
  @Get('/all')
  @ApiResponse({ type: VariantGetAllResponse })
  async getVariants(
    @Query() query: GetAllDto,
    @Headers('lang') lang: LangEnum,
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('pagesize', new DefaultValuePipe(100)) pagesize?: number,
  ): Promise<VariantGetAllResponse> {
    query = { ...query, ...{ page: +page - 1 }, pagesize };
    const changedQuery = getQuery(query, [
      'height',
      'id',
      'productId',
      'image',
      'length',
      'status',
      'weight',
      'width',
      'parentId',
    ]);
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.variantService.GetAll(changedQuery, metadata),
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
      results: response.data?.map((variant) => {
        const doesNotHaveTranslation = !variant.values.translation?.ru
        if (doesNotHaveTranslation) variant.values.translation = { uz: [], ru: [], en: [] }

        return variant
      }) || [],
    };
  }

  @Post('/getAll')
  @ApiResponse({})
  async getAllVariants(
    @Body() body: GetAllVariantsDto,
    @Headers('lang') lang: LangEnum,
  ): Promise<any> {
    const page = body.pagination.page || 1;
    const pagesize = body.pagination.pagesize || 100;
    body = { ...body, ...{ page: +page - 1 }, pagesize } as any;
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.variantService.GetAllVariants(body, metadata),
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
        limit: +pagesize,
      },
      result: response.data,
    };
  }

  @Get('/getVariantGroupByImportId')
  @ApiResponse({})
  async getVariantGroupByImportId(@Query() body: any): Promise<any>{
    return lastValueFrom(this.variantService.GetValueByImportId(body)).catch((r) => {
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

  @Get('/:id')
  async getOne(
    @Param('id') id: string,
    @Query() query: GetOneDto,
    @Headers('lang') lang?: LangEnum,
  ): Promise<any> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.variantService.GetOne({ id, ...query }, metadata),
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
      data: response.data,
    };
  }

  @Post('/add')
  @ApiResponse({ type: [VariantDto] })
  async AddNew(
    @Body() body?: any,
    @Headers('lang') lang?: LangEnum,
  ): Promise<any> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.variantService.VariantAdd(body),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          error: 'error',
          message: e.message,
        },
        HttpStatus.NOT_FOUND,
      );
    });
    return {
      data: {
        ...response.data,
        values: body?.values,
      },
    };
  }

  @Put('/update')
  @ApiResponse({ type: VariantDto })
  async Update(@Body() body: any): Promise<any> {
    const response = await lastValueFrom(
      this.variantService.Update({variants: body.variants }),
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


    return {result: response.result || []};
  }

  @Put('/updateQuantity')
  @ApiResponse({})
  async UpdateQuantity(@Body() body: UpdateQuantityDto): Promise<any> {
    return lastValueFrom(this.variantService.UpdateQuantity(body));
  }

  @Delete('/delete/:id')
  @ApiResponse({})
  async Delete(@Param('id') id: number): Promise<any> {
    return lastValueFrom(this.variantService.Delete({ id })).catch((r) => {
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

  @Post('/setDiscountPercentage')
  @ApiResponse({})
  async setDiscountPercentageForVariant(@Body() body: any) {
    return await lastValueFrom(this.variantService.SetDiscountPercentageForVariant(body));
  }

  @Post('/group/setDiscountPercentage')
  @ApiResponse({})
  async setDiscountPercentageForVariantGroup(@Body() body: any) {
    return lastValueFrom(this.variantService.SetDiscountPercentageForVariantGroup(body));
  }

  @Post('/publishVariantGroup/:id')
  @ApiResponse({})
  async publishVariantGroup( @Param('id') id: string) {
    try {
      return await lastValueFrom(this.variantService.PublishVariantGroup({ variantGroupId: id }));
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: error.details
      }, HttpStatus.BAD_REQUEST, {
        cause: error
      });
    }
  }

  @Post('/publish')
  @ApiResponse({})
  async publish(@Body() body: PublishDto) {
    try {
      return await lastValueFrom(this.variantService.Publish({ ...body }));
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: error.details
      }, HttpStatus.BAD_REQUEST, {
        cause: error
      });
    }
  }

  @Get('sync/variant-groups')
  async syncAllVariantGroup() {
    return lastValueFrom(this.variantService.SyncAllVariantGroup({}));
  }
}
