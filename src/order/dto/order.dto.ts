import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Meta } from 'src/shared/dto';
import { JwtPayload } from '../../user/types';

export class OrderDto {
  @ApiProperty()
  @IsOptional()
  name: string;
}

export class OrderGetAllResponse {
  @ApiProperty()
  results: OrderDto[];

  @ApiProperty()
  meta: Meta;
}

export class OrderCancellationDto {
  @ApiProperty()
  @IsNumber()
  orderId: number;

  user?: JwtPayload;
}

export class OrderItemCancellationDto {
  @ApiProperty()
  @IsNumber()
  orderItemId: number;

  user?: JwtPayload;
}
