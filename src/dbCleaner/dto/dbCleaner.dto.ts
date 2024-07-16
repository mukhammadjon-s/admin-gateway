import { ApiProperty } from '@nestjs/swagger';

export class DbCleanDto {
  @ApiProperty()
  result: string;

  @ApiProperty({ isArray: true, nullable: true })
  errors?: string[];
}
