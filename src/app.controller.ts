import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  signPublicUploadUrl,
  uploadFileWithBuffer,
} from '@padishah/toolbox/s3/server';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('sign-upload')
  signUpload(
    @Body('fileName') fileName: string,
    @Body('contentType') contentType: string,
  ) {
    let uuid = uuidv4();
    const image = fileName.split('.');
    let imageName = image[1]
      ? `${image[0]}_${uuid}.${image[1]}`
      : `${image}_${uuid}`;
    return signPublicUploadUrl({
      fileName: imageName,
      contentType,
      bucket: 'padishah-storage',
      prefix: 'admin',
    });
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhotoToS3(@UploadedFile() file: any) {
    let uuid = uuidv4();
    const image = file?.originalname?.split('.');
    let imageName = image[1]
      ? `${image[0]}_${uuid}.${image[1]}`
      : `${image}_${uuid}`;
    const s3Config = {
      fileName: imageName,
      contentType: file?.mimetype,
      bucket: process.env.AWS_BUCKET_NAME,
      prefix: 'admin',
      expires: 3600,
    };

    const result: any = await signPublicUploadUrl(s3Config);
    const location = await uploadFileWithBuffer(
      file.buffer,
      imageName,
      file?.mimetype,
    );

    return { url: location };
  }
}
