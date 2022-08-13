import {
  IsBoolean, IsEmail, IsEnum, IsString, IsUUID,
} from 'class-validator';
import { UserRoles } from '../enum';

export default class UserDto {
  @IsUUID()
    id: string;

  @IsEmail()
    email: number;

  @IsBoolean()
    isSeller: boolean;

  @IsString()
    username: string;

  @IsString()
  @IsEnum(UserRoles)
    role: UserRoles;

  @IsString()
    phone: string;
}
