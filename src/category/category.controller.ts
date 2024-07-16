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
import { CategoryDto, CategoryGetAllResponse } from './dto/category.dto';
import { lastValueFrom } from 'rxjs';
import { GetAllDto } from './dto/get.all.dto';
import { GetOneDto } from './dto/get.one.dto';
import { LangEnum } from '../shared/enums/enum';
import { Metadata } from '@grpc/grpc-js';
import {
  getField,
  getQuery,
  jsonValueToProto,
  structProtoToJson,
} from '../shared/utils';
import * as _ from 'lodash';
import { AtAuthGuard } from '../user/guards/at-auth.guard';

@Controller('category')
@UseGuards(AtAuthGuard)
export class CategoryController implements OnModuleInit {
  private categoryService: CategoryControllerInterface;

  constructor(@Inject(GRPC_PRODUCT_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.categoryService =
      this.client.getService<CategoryControllerInterface>('CategoryService');
  }

  @Get('/getAll')
  @ApiResponse({ type: CategoryGetAllResponse })
  async getAll(
    @Query() query: GetAllDto,
    @Headers('lang') lang: LangEnum,
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('pagesize', new DefaultValuePipe(100)) pagesize?: number,
  ): Promise<CategoryGetAllResponse> {
    query = { ...query, ...{ page: +page - 1 }, pagesize };
    const changedQuery = getQuery(query, [
      'height',
      'id',
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
      this.categoryService.GetCategories(changedQuery, metadata),
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

  @Get('/tree')
  @ApiResponse({ type: [CategoryDto] })
  async getTree(@Headers('lang') lang: LangEnum): Promise<any> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.categoryService.GetTreeCategory({}, metadata),
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
      data: _.values(structProtoToJson(response.data)),
    };
  }

  @Get('/getOne/:id')
  async getOne(
    @Param('id') id: string,
    @Query() query: GetOneDto,
    @Headers('lang') lang?: LangEnum,
  ): Promise<any> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);
    const response = await lastValueFrom(
      this.categoryService.GetCategory({ id, ...query }, metadata),
    ).catch((e) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Field category_id should be a string or a string array.',
          message: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
    if (!response.data?.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'error',
          message: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: {
        ...response.data,
        translation: structProtoToJson(getField(response.data, 'translation')),
      },
    };
  }

  @Post('/addNew')
  @ApiResponse({ type: [CategoryDto] })
  async AddNew(
    @Body() body?: any,
    @Headers('lang') lang?: LangEnum,
  ): Promise<any> {
    const metadata = new Metadata();
    metadata.add('lang', `${lang}`);

    const oldTranslation = body.translation;
    if (oldTranslation?.ru?.name && oldTranslation?.ru?.name?.length > 0) {
      body.translation = jsonValueToProto(body.translation).structValue;

      if (body.parentId) {
        const parent = await lastValueFrom(
          this.categoryService.GetCategory({ id: body.parentId }, metadata),
        );

        if (Object.keys(parent).length === 0) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              error: 'error',
              message: 'Invalid parentId',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const response = await lastValueFrom(
        this.categoryService.AddNew({ ...body }),
      ).catch((e) => {
        console.log(e);
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'error',
            message: e.message,
          },
          HttpStatus.NOT_FOUND,
        );
      });
      if (response.data) {
        response.data.translation = oldTranslation;
      }

      return response;
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'ru name is required',
          message: 'error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('/update/:id')
  @ApiResponse({ type: CategoryDto })
  async Update(@Param('id') id: number, @Body() body: any): Promise<any> {
    const oldTranslation = body.translation;
    body.translation = jsonValueToProto(body.translation).structValue;

    if (body.parentId) {
      const parent = await lastValueFrom(
        this.categoryService.GetCategory({ id: body.parentId }),
      );

      if (Object.keys(parent).length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'error',
            message: 'Invalid parentId',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const response = await lastValueFrom(
      this.categoryService.Update({ id, ...body }),
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

    response.data.translation = oldTranslation;

    return response;
  }

  @Delete('/delete/:id')
  @ApiResponse({})
  async Delete(@Param('id') id: number): Promise<any> {
    return lastValueFrom(this.categoryService.Delete({ id })).catch((r) => {
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
