import {
  IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches,
} from 'class-validator';
import { UserRoles } from '../enum';

export default class SignUpRequestDto {
  @IsEmail()
  @IsNotEmpty()
    email: string;

  @IsOptional()
  @IsString()
    username: string;

  @IsNotEmpty()
  @IsString()
    name: string;

  @IsNotEmpty()
  @IsString()
    phone: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRoles)
    role: string;

  @IsString()
  @IsOptional()
  @Matches('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
    password: string;
}
