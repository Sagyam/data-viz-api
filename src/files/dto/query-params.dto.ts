import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  pageSize: number = 50;

  @IsString()
  @IsOptional()
  filterOn: string = 'type';

  @IsString()
  @IsOptional()
  filterOperator: string = 'equals';

  @IsString()
  @IsOptional()
  filterQuery: string;

  @IsString()
  @IsIn(['createdAt', 'name', 'type'])
  @IsOptional()
  sortBy: string = 'createdAt';

  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'asc';
}
