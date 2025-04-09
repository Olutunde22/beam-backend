import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { validate } from 'class-validator';
import { ValidationExceptions } from 'src/exceptions';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginDto } from '../modules/auth/dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string) {
    const errors = await validate(new LoginDto(req.body));
    if (errors.length > 0) {
      throw new ValidationExceptions(errors);
    }
    const user = await this.authService.validateUser(email, password);
    return user;
  }
}
