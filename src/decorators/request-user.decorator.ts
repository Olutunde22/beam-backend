import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface IUserPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface ISignInPayload {
  id: string;
  fullName: string;
  email: string;
}

export const RequestUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
