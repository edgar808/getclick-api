import {
  IsEmail, IsNotEmpty, IsString, Matches,
} from 'class-validator';

export default class SignInRequestDto {
  @IsEmail()
  @IsNotEmpty()
    email: string;

  @IsNotEmpty()
  @IsString()
  @Matches('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
    password: string;
}
