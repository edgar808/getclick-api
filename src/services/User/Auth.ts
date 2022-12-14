import { HttpError, UnauthorizedError } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { Token } from '../../data/models/Token';
import { User } from '../../data/models/User';
import { getClientIp } from '../../utils/request';
import { generateTokens, generateTokenByParams, verify } from '../../utils/jwt';
import UserService from './User';
import SignUpType from './typing/SignUpType';
import SignInType from './typing/SignInType';
import { TokenType } from '../../data/misc/enums';
import { ERRORS, HTTP_CODES } from '../../constants';
import Mailer from '../../modules/mailer';
import { Environment } from '../../config';
import { ResetPasswordRequestType } from './typing/PasswordType';

@Service()
export default class Auth {
  constructor(@Inject() private userService: UserService) {}

  async signUp({ request, data }: { request: Request, data: SignUpType }) {
    const user = await this.userService.create({ data });
    const ip = getClientIp({ request });
    const { accessToken, refreshToken } = await this.generateTokenDuringSign({ user, ip });
    return { user, accessToken, refreshToken };
  }

  async signIn({ request, data }: { request: Request, data: SignInType }) {
    const user = await this.userService.getByEmail(data.email);
    if (!user) throw new UnauthorizedError(ERRORS.EMAIL_OR_PASSWORD_NOT_VALID);

    const password = await this.userService.generatePassword(user.salt, data.password);

    if (password !== user.password) throw new UnauthorizedError(ERRORS.EMAIL_OR_PASSWORD_NOT_VALID);

    const ip = getClientIp({ request });
    const { accessToken, refreshToken } = await this.generateTokenDuringSign({ user, ip });

    const userJson = user.toJSON();
    delete userJson.password;
    delete userJson.salt;

    return { user: userJson, accessToken, refreshToken };
  }

  async forgotPassword({ email }: { email: string }) {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new UnauthorizedError(ERRORS.USER_NOT_FOUND);
    const token = await generateTokenByParams({ email, type: TokenType.FORGOT_PASSWORD });

    await Token.upsert({
      userId: user.id, token, type: TokenType.FORGOT_PASSWORD, email,
    });

    await Mailer.forgotPassword(email, token);

    return { token };
  }

  async resetPassword({ password, token }: ResetPasswordRequestType) {
    const existToken = await Token.findOne({ where: { token, type: TokenType.FORGOT_PASSWORD } });
    if (!existToken) throw new UnauthorizedError(ERRORS.TOKEN_DOES_NOT_VALID);
    try {
      await verify(token, Environment.VerificationTokenSecret);
    } catch (err) {
      throw new UnauthorizedError(ERRORS.TOKEN_EXPIRED);
    }
    const user = await User.findOne({ where: { id: existToken.userId } });
    if (!user) throw new UnauthorizedError(ERRORS.USER_NOT_FOUND);
    await this.userService.setPassword(password, user);
    return user.toJSON();
  }

  async refreshTokenUpdate({ token } : { token: string }) {
    const verifiedToken: { userId: string, role: string } = await verify(token, Environment.RefreshTokenSecret);
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
