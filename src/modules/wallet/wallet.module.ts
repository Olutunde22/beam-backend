import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/src/typeorm/entities/user.model';
import { Transaction } from '@/src/typeorm/entities/transaction.model';
import { Wallet } from '@/src/typeorm/entities/wallet.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction, Wallet])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
