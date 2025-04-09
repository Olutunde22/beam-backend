import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { AuthService } from './auth.service';
import { HelperEncryptionService } from '../helper/services/helper.encryption.service';
import { ConfigService } from '@nestjs/config';
import { IUserPayload } from '@/decorators';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly helperEncryptionService: HelperEncryptionService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) throw new UnauthorizedException('Invalid token');

    try {
      if (authorization && authorization.split(' ')[1]) {
        const accessTokenDecoded = await this.authService.decodeAccessToken(
          authorization.split(' ')[1]!,
        );
        const cryptoKey = this.configService.get<string>(
          'app.cryptoKey',
        ) as string;
        const cryptoIv = this.configService.get<string>(
          'app.cryptoiv',
        ) as string;

        const payload: IUserPayload =
          this.helperEncryptionService.cryptoDecipher(
            accessTokenDecoded.data,
            cryptoKey,
            cryptoIv,
          );

        if (!payload.id) {
          throw new ForbiddenException(
            'You are not authorized to access this route',
          );
        }

        req.user = payload;
        return next();
      }
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}
