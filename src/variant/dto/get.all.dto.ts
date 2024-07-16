import { ApiProperty } from '@nestjs/swagger';
import { StatusCategory } from '../../shared/enums/enum';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAllDto {
  @ApiProperty()
  type?: string;
  @ApiProperty()
  variantFields?: boolean;
  @ApiProperty()
  variantValues?: boolean;
  @ApiProperty()
  id?: string;
  @ApiProperty()
  height?: string;
  @ApiProperty()
  image?: string;
  @ApiProperty()
  length?: string;
  @ApiProperty()
  status?: StatusCategory;
  @ApiProperty()
  weight?: string;
  @ApiProperty()
  width?: string;
  @ApiProperty()
  page?: number;
  @ApiProperty()
  pagesize?: number;
  // @ApiProperty()
  // where?: {
  //   id?: string;
  //   height?: string;
  //   image?: string;
  //   length?: string;
  //   status?: StatusCategory;
  //   weight?: string;
  //   width?: string;
  // };
}

export class PaginationDto {
  @ApiProperty({required: false, default: 1})
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({required: false, default: 100})
  @IsNumber()
  @IsOptional()
  pagesize: number;
}

export class GetAllVariantsWhereDto {
  @ApiProperty()
  height?: string;
  @ApiProperty()
  image?: string;
  @ApiProperty()
  length?: string;
  @ApiProperty()
  status?: StatusCategory;
  @ApiProperty()
  weight?: string;
  @ApiProperty()
  width?: string;
}

export class GetAllFiltersDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  warehouseId: string;

  @ApiProperty()
  where: GetAllVariantsWhereDto;
}

export class FieldsToLoadDto {
  @ApiProperty()
  @IsBoolean()
  product: boolean;

  @ApiProperty()
  @IsBoolean()
  brand: boolean;

  @ApiProperty()
  @IsBoolean()
  categories: boolean;
}

export class GetAllVariantsDto {
  @ApiProperty()
  filters: GetAllFiltersDto;

  @ApiProperty()
  fieldsToLoad: FieldsToLoadDto;

  @ApiProperty()
  pagination: PaginationDto;
}
