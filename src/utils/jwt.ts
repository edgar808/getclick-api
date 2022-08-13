import * as jwt from 'jsonwebtoken';
import {
  accessTokenSecret, accessTokenLife, refreshTokenSecret, refreshTokenLife, verificationTokenSecret, verificationTokenLife,
} from '../config';

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
    secret: accessTokenSecret,
    expiresIn: accessTokenLife,
  });

  const refreshToken = await generateToken({
    data: { userId, role },
    secret: refreshTokenSecret,
    expiresIn: refreshTokenLife,
  });

  return { accessToken, refreshToken };
};

export const generateVerifyToken = async (userId: any) => generateToken({
  data: { userId },
  secret: verificationTokenSecret,
  expiresIn: verificationTokenLife,
});

export const generateTokenByParams = async (data: any) => generateToken({
  data,
  secret: verificationTokenSecret,
  expiresIn: verificationTokenLife,
});

export const verify = async (token: any, secret: any) => jwt.verify(token, secret);

