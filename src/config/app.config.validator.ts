import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  readonly NODE_ENV: Environment;

  @IsNumber()
  readonly PORT: number;

  @IsString()
  @IsOptional()
  readonly GLOBAL_PREFIX: string;

  @IsString()
  readonly DB_HOST: string;

  @IsNumber()
  readonly DB_PORT: number;

  @IsString()
  readonly DB_USER: string;

  @IsString()
  readonly DB_PASSWORD: string;

  @IsString()
  readonly DB_NAME: string;

  @IsString()
  readonly VERSION: string;

  @IsString()
  readonly ACCESS_TOKEN_SECRET: string;

  @IsString()
  readonly ACCESS_TOKEN_EXPIRES: string;

  @IsString()
  readonly CRYPTO_KEY: string;

  @IsString()
  readonly CRYPTO_IV: string;

  @IsString()
  readonly SALT_ROUNDS: string;

  @IsString()
  readonly BASE_URL: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
