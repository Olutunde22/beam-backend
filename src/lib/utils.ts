import ms from 'ms';
import { Environment } from '../config/app.config.validator';

export const acceptedDomains = {
  [Environment.Development]: ['http://localhost:5173'],
  [Environment.Staging]: ['https://beam-frontend-reoz.onrender.com'],
  [Environment.Production]: ['https://beam.com'],
};

export const sec = (value: string): number => {
  return ms(value as ms.StringValue) / 1000;
};

export const mill = (value: string): number => {
  return ms(value as ms.StringValue);
};
