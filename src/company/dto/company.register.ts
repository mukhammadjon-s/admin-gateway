import { HolderType } from './../../shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CompanyRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  legalName: string;

  @ApiProperty()
  @IsOptional()
  holderType: HolderType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  inn: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tgPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bankAccountId: string;
}

export class RegisterCompanyPaymentDataDto {
  @ApiProperty()
  @IsString()
  account: string;

  @ApiProperty()
  @IsString()
  mfo: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  inn: string;

  @ApiProperty()
  @IsOptional()
  cashId: string;
}

export class RegisterCompanyPaymentDataResponseDto {
  @ApiProperty()
  @IsString()
  id: string
}
