import * as dotenv from 'dotenv';

dotenv.config();

export class Environment {
  public static readonly HOST = process.env;

  public static readonly PORT = process.env.PORT || 4000;

  public static readonly CORS_LIST = process.env.CORS_WHITE_LIST;

  public static readonly DB_SCHEMA = process.env.DB_SCHEMA;

  public static readonly DB_CONFIG = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    define: {
      schema: process.env.DB_SCHEMA,
    },
    logging: Boolean(parseInt(process.env.DB_LOGGING, 10)) || false,
    pool: {
      handleDisconnects: true,
      max: process.env.DB_CONNECTIONS_MAX || 30,
      min: process.env.DB_CONNECTIONS_MIN || 5,
      idle: process.env.DB_CONNECTIONS_IDLE_TIME || 60000,
      acquire: process.env.DB_CONNECTIONS_ACQUIRE_TIME || 20000,
    },
  };

  public static readonly CryptoConfig = {
    hash: {
      length: 128,
      iterations: 10,
    },
  };

  public static readonly MailerConfig = {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDER: process.env.SENDGRID_SENDER_EMAIL || 'dev+1@brainstormtech.io',
  };

  public static readonly AccessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'LOCAL_ACCESS_TOKEN_SECRET_KEY';

  public static readonly AccessTokenLife = process.env.ACCESS_TOKEN_LIFE || '30d';

  public static readonly RefreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '90d';

  public static readonly RefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'LOCAL_REFRESH_TOKEN_SECRET_KEY';

  public static readonly VerificationTokenSecret = process.env.VERIFICATION_TOKEN_SECRET || 'LOCAL_VERIFICATION_TOKEN_SECRET_KEY';

  public static readonly VerificationTokenLife = process.env.VERIFICATION_TOKEN_LIFE || '2d';

  public static readonly FrontBaseUrl = process.env.FRONT_BASE_URL || 'https://shipment-agora.brainstormtech.io/';

  public static readonly FrontResetPasswordUrl = process.env.FRONT_RESET_PASSWORD_URL || 'reset-password';

  public static readonly AuthUser = process.env.AUTHORIZATION_USER.split(',');

  public static readonly AuthPass = process.env.AUTHORIZATION_PASS.split(',');

  public static EmailSubjects = {
    AFTER_SIGNUP: 'Sigma Application',
    EMAIL_VERIFICATION: 'Sigma Application Email Verification',
    INVITE: 'INVITE IN SIGMA APPLICATION ',
    ORDER: 'ORDER',
    NEW_MESSAGE: 'NEW MESSAGE',
    NEW_OFFER: 'NEW OFFER',
    DECLINE_OFFER: 'OFFER DECLINED',
    COUNTER_OFFER: 'COUNTER OFFER',
    RESET_PASSWORD: 'RESET PASSWORD',
    PRICE_DROP: 'PRICE DROP',
    NEW_APPLICATION: 'NEW APPLICATION',
    APPLICATION_DECLINE: 'APPLICATION DECLINE',
    ORDER_CONFIRMATION: 'ORDER CONFIRMATION',
    SHIPPING_STATUS: 'SHIPPING STATUS CHANGED',
  };
}

export const { DB_CONFIG } = Environment;
