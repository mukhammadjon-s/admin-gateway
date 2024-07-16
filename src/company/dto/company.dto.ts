import { ApiProperty } from '@nestjs/swagger';
import { CompanyStatus } from '../../shared/enums/enum';
import { IsOptional } from 'class-validator';
import { Meta } from 'src/shared/dto';

export class CompanyDto {
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

export class UpdateCompanyDto {
  company: CompanyDto
}

export class CompanyGetAllResponse {
  @ApiProperty()
  results: CompanyDto[];

  @ApiProperty()
  meta: Meta;
}
