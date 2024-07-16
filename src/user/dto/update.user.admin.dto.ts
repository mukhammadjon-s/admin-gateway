import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { RolesEnum } from '../enums';

export class UpdateUserAdminDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  middleName: string;
  
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  msisdn: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  language: string;

  @ApiProperty({
    type: [RolesEnum],
    isArray: true,
  })
  @IsOptional()
  @IsEnum(RolesEnum, { each: true })
  role: string;
}