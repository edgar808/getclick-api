import {
  IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString,
} from 'class-validator';
import { UserRoles } from '../enum';
import { PaginationQueryParamDto } from '../QueryParamsDto';

export default class UserGetDto extends PaginationQueryParamDto {
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
    isVerified: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRoles)
    role: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
    sortField: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
    sortOrder: string;
}
