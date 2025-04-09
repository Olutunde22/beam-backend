import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ISignInPayload, RequestUser } from '@/decorators';
import { UserDoc } from './user.doc';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UserDoc()
  async getCurrentUser(@RequestUser() user: ISignInPayload) {
    return this.userService.getCurrentUser(user.id);
  }
}
