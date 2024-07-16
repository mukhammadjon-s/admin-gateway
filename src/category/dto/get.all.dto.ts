import { ApiProperty } from '@nestjs/swagger';
import { StatusCategory } from '../../shared/enums/enum';

export class GetAllDto {
  @ApiProperty()
  type?: string;
  @ApiProperty()
  variantFields?: boolean;
  @ApiProperty()
  variantValues?: boolean;
  @ApiProperty()
  id?: string;
  @ApiProperty()
  height?: string;
  @ApiProperty()
  image?: string;
  @ApiProperty()
  icon?: string;
  @ApiProperty()
  length?: string;
  @ApiProperty()
  status?: StatusCategory;
  @ApiProperty()
  weight?: string;
  @ApiProperty()
  width?: string;
  @ApiProperty()
  page?: number;
  @ApiProperty()
  pagesize?: number;
  // @ApiProperty()
  // where?: {
  //   id?: string;
  //   height?: string;
  //   image?: string;
  //   length?: string;
  //   status?: StatusCategory;
  //   weight?: string;
  //   width?: string;
  // };
}
