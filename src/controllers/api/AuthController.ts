import {
  Body, JsonController, Post, Req,
} from 'routing-controllers';
import { Request } from 'express';
import { Inject, Service } from 'typedi';
import SignUpRequestDto from '../dto/user/SignUpRequestDto';
import SignInRequestDto from '../dto/user/SignInRequestDto';
import { ConfirmEmailRequestDto, ResetPasswordRequestDto, RefreshTokenRequestDto } from '../dto/user/PasswordRequestDto';
import Auth from '../../services/User/Auth';

@Service()
@JsonController('/auth')
export default class AuthController {
  constructor(@Inject() private authService: Auth) {}

  @Post('/sign-up')
  async signup(@Req() request: Request, @Body({ required: true }) body: SignUpRequestDto) {
    const data = await this.authService.signUp({ request, data: body });
    return data;
  }

  @Post('/sign-in')
  async signin(@Req() request: Request, @Body({ required: true }) body: SignInRequestDto) {
    const data = await this.authService.signIn({ request, data: body });
    return data;
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body({ required: true }) body: ConfirmEmailRequestDto) {
    const { email } = body;
    return this.authService.forgotPassword({ email });
  }

  @Post('/resetPassword')
  async resetPassword(@Body({ required: true }) body: ResetPasswordRequestDto) {
    const { token, password } = body;
    return this.authService.resetPassword({ token, password });
  }

  @Post('/refreshToken')
  async refreshToken(@Body({ required: true }) body: RefreshTokenRequestDto) {
    const { token } = body;
    return this.authService.refreshTokenUpdate({ token });
  }
}
