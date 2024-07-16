import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Meta } from 'src/shared/dto';

export class CartDto {
  @ApiProperty()
  @IsOptional()
  name: string;
}

export class CartGetAllResponse {
  @ApiProperty()
  results: CartDto[];

  @ApiProperty()
  meta: Meta;
}
