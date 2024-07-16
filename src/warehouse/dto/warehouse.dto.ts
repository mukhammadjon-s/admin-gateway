/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { CompanyStatus } from '../../shared/enums/enum';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Meta } from 'src/shared/dto';

export class WarehouseDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  addressId: number;

  @ApiProperty()
  @IsOptional()
  companyId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty()
  @IsOptional()
  districtId: number;

  @ApiProperty()
  @IsOptional()
  regionId: number;
}

export class WarehouseGetAllResponse {
  @ApiProperty()
  results: WarehouseDto[];

  @ApiProperty()
  meta: Meta;
}

