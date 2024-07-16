import { ApiProperty } from '@nestjs/swagger';

export class DeleteApiResponse {
  @ApiProperty()
  success: boolean;
}

export class Meta {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
