import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ISignInPayload, RequestUser, SkipAuth } from '@/src/decorators';
import { LocalAuthGuard } from '@/src/guards';
import { LoginDto } from './dto/login.dto';
import { LoginDoc, RegisterDoc } from './auth.doc';

@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @RegisterDoc()
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @UseGuards(LocalAuthGuard)
  @LoginDoc()
  @Post('/login')
  async login(@Body() _body: LoginDto, @RequestUser() user: ISignInPayload) {
    return await this.authService.login(user);
  }
}
