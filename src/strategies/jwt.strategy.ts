import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserPayload } from '@/decorators/request-user.decorator';
import { HelperEncryptionService } from '@/modules/helper/services/helper.encryption.service';
import { JwtPayload } from '../modules/auth/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly helperEncryptionService: HelperEncryptionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.accessTokenSecret')!,
    });
  }

  validate(payload: JwtPayload) {
    const cryptoKey = this.configService.get<string>('app.cryptoKey') as string;
    const cryptoIv = this.configService.get<string>('app.cryptoiv') as string;

    const cipher: IUserPayload = this.helperEncryptionService.cryptoDecipher(
      payload.data,
      cryptoKey,
      cryptoIv,
    );
    if (!cipher.id) {
      throw new UnauthorizedException(
        'You must be authorized to access this route',
      );
    }

    return cipher;
  }
}
