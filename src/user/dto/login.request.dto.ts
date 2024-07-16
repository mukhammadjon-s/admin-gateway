import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  size: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  timeout: number;
}

export class VerifyCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  msisdn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
