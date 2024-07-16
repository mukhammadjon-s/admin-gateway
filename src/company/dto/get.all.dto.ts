import { ApiProperty } from '@nestjs/swagger';
import { CompanyStatus } from '../../shared/enums/enum';

export class GetAllDto {
  @ApiProperty()
  // @IsOptional()
  status?: CompanyStatus;

  @ApiProperty()
  // @IsOptional()
  type?: string;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  pagesize?: number;

  @ApiProperty()
  companyId?: number;
}
