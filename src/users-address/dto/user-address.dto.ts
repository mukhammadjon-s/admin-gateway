import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserAddressCreateDto {
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  regionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  districtId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  comment: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  postalCode: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  default: boolean;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}

export class UserAddressCommonDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  regionId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  districtId: number;

  @IsString()
  @IsOptional()
  comment: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  postalCode: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  default: boolean;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}

export class UserAddressDeleteDto {
  @IsString()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  id: number;
}

export class UserAddressGetAllResponseDto {
  @ApiProperty({ type: [UserAddressCommonDto] })
  result: UserAddressCommonDto[] | undefined;
  @ApiProperty()
  errors?: string[];
}

export class UserAddressCreateResponseDto {
  @ApiProperty({ type: UserAddressCommonDto })
  result: UserAddressCommonDto | undefined;
  @ApiProperty()
  errors?: string[];
}

export class UserAddressUpdateResponseDto {
  @ApiProperty({ type: UserAddressCommonDto })
  result: UserAddressCommonDto | undefined;
  @ApiProperty()
  errors?: string[];
}

export class UserAddressDeleteResponseDto {
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  errors?: string[];
}

export class UserAddressGetAllDto {
  @ApiProperty()
  userId: number;
}
