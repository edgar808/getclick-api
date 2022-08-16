import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryParamDto {
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
    offset = 0;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
    limit = 50;

  constructor(offset: number, limit: number) {
    this.offset = offset ?? this.offset;
    this.limit = limit ?? this.limit;
  }
}

export class QueryParamSearchDto extends PaginationQueryParamDto {
  @IsOptional()
  @IsNotEmpty()
    searchKay: string;
}
