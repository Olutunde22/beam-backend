import {
  ClassSerializerInterceptor,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/app.config.module';
import { DatabaseModule } from './modules/database/database.module';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { UserModule } from './modules/user/user.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor, ResponseInterceptor } from './interceptors';
import { AllExceptionFilter } from './exceptions';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { JwtModule } from '@nestjs/jwt';
import { HelperModule } from './modules/helper/helper.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './guards';
import { SeederModule } from './modules/database/seeders/seeder.module';
import { SeederService } from './modules/database/seeders/seeder.service';

@Module({
  imports: [
    TerminusModule,
    SeederModule,
    JwtModule.register({}),
    HelperModule,
    ConfigModule,
    DatabaseModule,
    UserModule,
    WalletModule,
    TransactionsModule,
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        {
          ttl: 30000,
          limit: 10,
        },
      ],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    TypeOrmHealthIndicator,
  ],
  exports: [TypeOrmHealthIndicator],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seederService: SeederService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seederService.run();
  }
}
