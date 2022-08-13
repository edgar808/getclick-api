import { HttpError, UnauthorizedError } from 'routing-controllers';
import { Token } from '../../data/models/Token';
import { User } from '../../data/models/User';
import { getClientIp } from '../../utils/request';
import { generateTokens, generateTokenByParams, verify } from '../../utils/jwt';
import UserService from './index';
import SignUpType from './typing/SignUpType';
import SignInType from './typing/SignInType';
import { TokenType } from '../../data/misc/enums';
import { ERRORS, HTTP_CODES } from '../../constants';
import Mailer from '../../modules/mailer';
import {
  frontBaseUrl,
  frontResetPasswordUrl,
  refreshTokenSecret,
  verificationTokenSecret,
} from '../../config';
import { ResetPasswordRequestType } from './typing/PasswordType';

export default class Auth {
  async signUp({ request, data }: { request: Request, data: SignUpType }) {
    const user = await UserService.user.create({ data });
    const ip = getClientIp({ request });
    const { accessToken, refreshToken } = await this.generateTokenDuringSign({ user, ip });
    return { user, accessToken, refreshToken };
  }

  async signIn({ request, data }: { request: Request, data: SignInType }) {
    const user = await UserService.user.getByEmail(data.email);
    if (!user) throw new UnauthorizedError(ERRORS.EMAIL_OR_PASSWORD_NOT_VALID);

    const password = await UserService.user.generatePassword(user.salt, data.password);

    if (password !== user.password) throw new UnauthorizedError(ERRORS.EMAIL_OR_PASSWORD_NOT_VALID);

    const ip = getClientIp({ request });
    const { accessToken, refreshToken } = await this.generateTokenDuringSign({ user, ip });

    const userJson = user.toJSON();
    delete userJson.password;
    delete userJson.salt;

    return { user: userJson, accessToken, refreshToken };
  }

  async forgotPassword({ email }: { email: string }) {
    const user = await UserService.user.getByEmail(email);
    if (!user) throw new UnauthorizedError(ERRORS.USER_NOT_FOUND);
    const token = await generateTokenByParams({ email, type: TokenType.FORGOT_PASSWORD });

    await Token.upsert({
      userId: user.id, token, type: TokenType.FORGOT_PASSWORD, email,
    });

    await Mailer.sendEmail({
      to: email,
      subject: 'Reset your password',
      template: 'forgot-password',
      params: {
        user,
        data: {
          link: `${frontBaseUrl}${frontResetPasswordUrl}?token=${token}`,
        },
      },
    });
    return { token };
  }

  async resetPassword({ password, token }: ResetPasswordRequestType) {
    const existToken = await Token.findOne({ where: { token, type: TokenType.FORGOT_PASSWORD } });
    if (!existToken) throw new UnauthorizedError(ERRORS.TOKEN_DOES_NOT_VALID);
    try {
      await verify(token, verificationTokenSecret);
    } catch (err) {
      throw new UnauthorizedError(ERRORS.TOKEN_EXPIRED);
    }
    const user = await User.findOne({ where: { id: existToken.userId } });
    if (!user) throw new UnauthorizedError(ERRORS.USER_NOT_FOUND);
    await UserService.user.setPassword(password, user);
    return user.toJSON();
  }

  async refreshTokenUpdate({ token } : { token: string }) {
    const verifiedToken: { userId: string, role: string } = await verify(token, refreshTokenSecret);
    const { userId } = verifiedToken;
    const refreshToken = await Token.findOne({ where: { userId, token } });
    if (!refreshToken) throw new UnauthorizedError(ERRORS.TOKEN_EXPIRED);

    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(HTTP_CODES.BadRequest, ERRORS.RESOURCE_NOT_FOUND);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user.id, user.role);

    await refreshToken.update({ token: newRefreshToken });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async generateTokenDuringSign({ user, ip }: any) {
    const { accessToken, refreshToken } = await generateTokens(user.id, user.role);

    await Token.upsert({
      userId: user.id, ip, token: refreshToken, type: TokenType.REFRESH,
    });
    return { accessToken, refreshToken };
  }
}
