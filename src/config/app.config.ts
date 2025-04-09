import { registerAs } from '@nestjs/config';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT ?? 3000),
  globalPrefix: process.env.GLOBAL_PREFIX ?? '/api/v1',
  version: process.env.VERSION ?? '1.0',
  isDev: process.env.NODE_ENV !== 'production',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  cryptoKey: process.env.CRYPTO_KEY,
  cryptoIv: process.env.CRYPTO_IV,
  saltRounds: Number(process.env.SALT_ROUNDS ?? '10'),
  baseUrl: process.env.BASE_URL,
};

export type AppConfig = typeof config;

export default registerAs('app', (): AppConfig => config);
