import * as dotenv from 'dotenv';

dotenv.config();

export const { HOST } = process.env;

export const PORT = process.env.PORT || 4000;

export const CORS_LIST = process.env.CORS_WHITE_LIST;

export const { DB_SCHEMA } = process.env;

export const DB_CONFIG = {
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

export const cryptoConfig = {
  hash: {
    length: 128,
    iterations: 10,
  },
};

export const mailerConfig = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDER: process.env.SENDGRID_SENDER_EMAIL || 'dev+1@brainstormtech.io',
};

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'LOCAL_ACCESS_TOKEN_SECRET_KEY';

export const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '30d';

export const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '90d';

export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'LOCAL_REFRESH_TOKEN_SECRET_KEY';

export const verificationTokenSecret = process.env.VERIFICATION_TOKEN_SECRET || 'LOCAL_VERIFICATION_TOKEN_SECRET_KEY';

export const verificationTokenLife = process.env.VERIFICATION_TOKEN_LIFE || '2d';

export const frontBaseUrl = process.env.FRONT_BASE_URL || 'https://shipment-agora.brainstormtech.io/';

export const frontResetPasswordUrl = process.env.FRONT_RESET_PASSWORD_URL || 'reset-password';

export const authUser = process.env.AUTHORIZATION_USER.split(',');
export const authPass = process.env.AUTHORIZATION_PASS.split(',');
