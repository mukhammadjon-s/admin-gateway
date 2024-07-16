import { ApiProperty } from '@nestjs/swagger';
import { CompanyStatus } from '../../shared/enums/enum';
import { IsNumber, IsOptional } from 'class-validator';
import { Meta } from 'src/shared/dto';

export class VariantDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  legalName: string;

  @ApiProperty()
  @IsOptional()
  logo: string;

  @ApiProperty()
  @IsOptional()
  mfo: string;

  @ApiProperty()
  @IsOptional()
  holderType: string;

  @ApiProperty()
  @IsOptional()
  directorFullName: string;

  @ApiProperty()
  @IsOptional()
  bankName: string;

  @ApiProperty()
  branchName: string;

  @ApiProperty()
  @IsOptional()
  branchCode: string;

  @ApiProperty()
  @IsOptional()
  oked: string;

  @ApiProperty()
  @IsOptional()
  inn: string;

  @ApiProperty()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  orderType: string;

  @ApiProperty()
  @IsOptional()
  legalAddress: string;

  @ApiProperty()
  @IsOptional()
  addressId: string;

  @ApiProperty()
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsOptional()
  status: CompanyStatus;
}

export class VariantGetAllResponse {
  @ApiProperty()
  results: VariantDto[];

  @ApiProperty()
  meta: Meta;
}

export class UpdateQuantityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class UnpublishedGroupsDto {
  @ApiProperty()
  @IsOptional()
  query: string;

  @ApiProperty()
  @IsOptional()
  page: number;

  @ApiProperty()
  @IsOptional()
  pagesize: number;
}
