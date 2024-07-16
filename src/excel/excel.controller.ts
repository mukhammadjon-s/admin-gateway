import { Controller, Get, Header, Inject, Post, Res } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { ProductControllerInterface } from '../product/interfaces/product.interface';
import { GRPC_PRODUCT_PACKAGE } from '../product/constants';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('excel')
export class ExcelController {
  private productService: ProductControllerInterface;

  constructor(@Inject(GRPC_PRODUCT_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductControllerInterface>('ProductService');
  }

  @Get('/download')
  @Header('Content-type', 'text/xlsx')
  async downloadReport(@Res() res: Response) {
    // let result = await this.excelService.downloadExcel();
    // res.download(`${result}`);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    file.buffer = file.buffer.toString('base64') as any;
    return lastValueFrom(this.productService.UploadExcel(file));
  }
}
