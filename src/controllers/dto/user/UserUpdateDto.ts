import {
  IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString,
} from 'class-validator';
import { UserRoles } from '../enum';

export default class UserUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRoles)
    role: string;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
    isVerified: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
    name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
    phone: string;
}
