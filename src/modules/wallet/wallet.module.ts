import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/typeorm/entities/user.model';
import { Transaction } from '@/typeorm/entities/transaction.model';
import { Wallet } from '@/typeorm/entities/wallet.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction, Wallet])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
