import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/src/typeorm/entities/user.model';
import { JwtStrategy, LocalStrategy } from '@/src/strategies';
import { AuthMiddleware } from './auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { HelperModule } from '../helper/helper.module';
import { Wallet } from '@/src/typeorm/entities/wallet.model';
import { Bank } from '@/src/typeorm/entities/bank.model';
import { WalletController } from '../wallet/wallet.controller';
import { TransactionsController } from '../transactions/transactions.controller';
import { UserController } from '../user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Wallet]),
    TypeOrmModule.forFeature([Bank]),
    JwtModule,
    HelperModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/health', method: RequestMethod.GET },
        { path: '/auth/register', method: RequestMethod.POST },
      )
      .forRoutes(WalletController, TransactionsController, UserController);
  }
}
