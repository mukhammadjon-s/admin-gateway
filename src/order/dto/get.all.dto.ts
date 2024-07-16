import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class FieldsToLoadDto {
  @ApiProperty()
  @IsOptional()
  address?: boolean | undefined;

  @ApiProperty()
  @IsOptional()
  orderUser?: boolean | undefined;

  @ApiProperty()
  @IsOptional()
  items?: boolean | undefined;

  @ApiProperty()
  @IsOptional()
  deliveryType?: boolean | undefined;

  @ApiProperty()
  @IsOptional()
  payments?: boolean | undefined;

  @ApiProperty()
  @IsOptional()
  reviews?: boolean | undefined;

  @ApiProperty()
  @IsOptional()
  count?: boolean | undefined;
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

export class GetAllFiltersDto {
  @IsOptional()
  companyId?: string;
}

export class GetAllDto {
  @ApiProperty()
  filters?: GetAllFiltersDto;

  @ApiProperty()
  fieldsToLoad: FieldsToLoadDto;

  @ApiProperty()
  pagination: PaginationDto;
}

export class GetAllOrderItemDto {
  @ApiProperty()
  orderId: string

  @ApiProperty({required: false, default: 1})
  @IsOptional()
  page: number;

  @ApiProperty({required: false, default: 100})
  @IsOptional()
  pagesize: number;
}
