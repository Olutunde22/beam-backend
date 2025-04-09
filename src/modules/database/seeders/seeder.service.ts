import { Injectable } from '@nestjs/common';
import { BankSeeder } from './bank.seeder';

@Injectable()
export class SeederService {
  constructor(private readonly bankSeeder: BankSeeder) {}

  async run() {
    await this.bankSeeder.seed();
  }
}
