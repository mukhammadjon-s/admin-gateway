import { ApiProperty } from '@nestjs/swagger';
import { IsOptional,IsNumber,IsString } from 'class-validator';
import { RolesEnum } from '../enums';

export class GetAllUserDto {
  @ApiProperty()
  @IsOptional()
  page: number;

  @ApiProperty()
  @IsOptional()
  pagesize: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  role: RolesEnum;
}

export class GetUserListDto {
  @ApiProperty()
  @IsOptional()
  page: number;

  @ApiProperty()
  @IsOptional()
  pagesize: number;
}
