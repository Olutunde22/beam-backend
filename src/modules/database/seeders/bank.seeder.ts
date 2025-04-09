import { Injectable } from '@nestjs/common';
import { banks } from './seeder.constant';
import { Bank } from '@/src/typeorm/entities/bank.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BankSeeder {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  async seed() {
    for (const bank of banks) {
      const createdBank = this.bankRepository.create(bank);
      await this.bankRepository.save(createdBank);
    }
  }
}
