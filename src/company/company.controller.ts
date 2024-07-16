import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  Query, UseGuards,
} from '@nestjs/common';
import { CompanyControllerInterface } from './interfaces/company.interface';
import { GRPC_COMPANY_PACKAGE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiResponse } from '@nestjs/swagger';
import { CompanyDto, CompanyGetAllResponse, UpdateCompanyDto } from './dto/company.dto';
import { lastValueFrom } from 'rxjs';
import { GetAllDto } from './dto/get.all.dto';
import { GetOneDto } from './dto/get.one.dto';
import {
  CompanyRegisterDto,
  RegisterCompanyPaymentDataDto,
  RegisterCompanyPaymentDataResponseDto,
} from './dto/company.register';
import { formatErrorMessage } from 'src/user/utils';
import { AtAuthGuard } from '../user/guards/at-auth.guard';
import { CurrentUser } from '../shared/global/decorators/current-user.decorator';

@Controller('company')
@UseGuards(AtAuthGuard)
export class CompanyController implements OnModuleInit {
  private companyService: CompanyControllerInterface;

  constructor(@Inject(GRPC_COMPANY_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.companyService =
      this.client.getService<CompanyControllerInterface>('CompanyService');
  }

  @Get('/getAll')
  @ApiResponse({ type: CompanyGetAllResponse })
  async getAll(
    @CurrentUser() user: any,
    @Query() query?: GetAllDto,
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('pagesize', new DefaultValuePipe(100)) pagesize?: number,
  ): Promise<any> {
    query = { ...query, ...{ page: +page - 1 }, pagesize };
    if (user?.companyId) query.companyId = +user.companyId;
    const response = await lastValueFrom(
      this.companyService.GetAll({ query }),
    ).catch((r) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          // mes: 'error',
          error: 'Not found this id',
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
  async getOne(@Param() param?: GetOneDto): Promise<any> {
    const data = await lastValueFrom(
      this.companyService.GetOne({ id: param.id }),
    ).catch((r) => {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: r.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
    return { data: data.company };
  }

  @Post('/addNew')
  @ApiResponse({})
  async AddNew(
    @Body() body?: { address?: any; company: CompanyRegisterDto },
  ): Promise<any> {
    return lastValueFrom(
      this.companyService.AddNew({
        address: body.address,
        company: body.company,
      }),
    ).catch((r) => {
      console.log(r);

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: formatErrorMessage(r.details || r.message),
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Put('/update/:id')
  @ApiResponse({ type: CompanyDto })
  async Update(
    @Param('id') id: number,
    @Body() body: UpdateCompanyDto,
  ): Promise<any> {
    return lastValueFrom(this.companyService.Update({ id, company: body?.company }));
  }

  @Delete('/delete/:id')
  @ApiResponse({})
  async Delete(@Param('id') id: number): Promise<any> {
    return lastValueFrom(this.companyService.Delete({ id })).catch((r) => {
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

  @Post('/registerCompanyPaymentData')
  async registerCompanyPaymentData(@Body() body: RegisterCompanyPaymentDataDto): Promise<RegisterCompanyPaymentDataResponseDto> {
    return lastValueFrom(this.companyService.RegisterCompanyPaymentData(body));
  }

  @Get('getCompanyInfo')
  async getCompanyInfo(
    @CurrentUser() user: any,
  ) {
    try {
      return await lastValueFrom(this.companyService.GetCompanyInfo({companyId: user?.companyId}))
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: error.details
      }, HttpStatus.BAD_REQUEST
     );
    }
  }
}
