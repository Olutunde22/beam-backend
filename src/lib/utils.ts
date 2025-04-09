import ms from 'ms';

export const acceptedDomains = ['http://localhost:5173'];

export const sec = (value: string): number => {
  return ms(value as ms.StringValue) / 1000;
};

export const mill = (value: string): number => {
  return ms(value as ms.StringValue);
};
