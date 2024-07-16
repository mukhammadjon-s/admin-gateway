import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';


export class ProductDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  season?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  country?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  brandId?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  length?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  weight?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  width?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  height?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rating?: number
}


export class PublishDto {
  @ApiProperty()
  @IsString()
  variantGroupId: string;

  @ApiProperty()
  @IsArray()
  images: string[]

  @ApiProperty()
  product: ProductDto
}
