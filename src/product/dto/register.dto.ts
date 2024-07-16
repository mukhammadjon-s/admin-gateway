import { ApiProperty } from '@nestjs/swagger';
// import { CompanyStatus } from '../../shared/enums/enum';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsObject,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class ProductAddDto {
  @ApiProperty({required: true})
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  weight: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  width: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  translation: object;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minAge: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  length: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isTop: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isSale: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPreorder: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  height: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  companyId: number;

  @ApiProperty({required: true})
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categories: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  material: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  country: string;
}
