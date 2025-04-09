import { Bank } from '@/src/typeorm/entities/bank.model';
import { Transaction } from '@/src/typeorm/entities/transaction.model';
import { User } from '@/src/typeorm/entities/user.model';
import { Wallet } from '@/src/typeorm/entities/wallet.model';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { BankSeeder } from './bank.seeder';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DB_HOST}`,
      port: parseInt(`${process.env.DB_PORT}`, 10),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_NAME}`,
      entities: [User, Bank, Wallet, Transaction],
      synchronize: process.env.NODE_ENV !== 'production',
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([Bank]),
  ],
  providers: [SeederService, BankSeeder],
  exports: [SeederService],
})
export class SeederModule {}
