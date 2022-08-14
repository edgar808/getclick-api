import * as jwt from 'jsonwebtoken';
import { Environment } from '../config';

export const generateToken = async ({
  data,
  secret,
  expiresIn,
}: any) => jwt.sign(
  data,
  secret,
  { expiresIn },
);

export const generateTokens = async (userId: any, role: any) => {
  const accessToken = await generateToken({
    data: { userId, role },
    secret: Environment.AccessTokenSecret,
    expiresIn: Environment.AccessTokenLife,
  });

  const refreshToken = await generateToken({
    data: { userId, role },
    secret: Environment.RefreshTokenSecret,
    expiresIn: Environment.RefreshTokenLife,
  });

  return { accessToken, refreshToken };
};

export const generateVerifyToken = async (userId: any) => generateToken({
  data: { userId },
  secret: Environment.VerificationTokenSecret,
  expiresIn: Environment.VerificationTokenLife,
});

export const generateTokenByParams = async (data: any) => generateToken({
  data,
  secret: Environment.VerificationTokenSecret,
  expiresIn: Environment.VerificationTokenLife,
});

export const verify = async (token: any, secret: any) => jwt.verify(token, secret);

