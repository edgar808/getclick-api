import {
  IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches,
} from 'class-validator';

export class ChangePasswordRequestBodySchemaDto {
  @IsNotEmpty()
  @IsString()
    oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Matches('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
    newPassword: string;

  @IsOptional()
  @IsUUID()
    userId: string;
}

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  @Matches('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
    password: string;

  @IsNotEmpty()
  @IsString()
    token: string;
}

export class ConfirmEmailRequestDto {
  @IsNotEmpty()
  @IsEmail()
    email: string;
}

export class RefreshTokenRequestDto {
  @IsNotEmpty()
  @IsString()
    token: string;
}
