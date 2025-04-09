import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from '@/typeorm/entities/transaction.model';
import { listTransactionMock } from '../../../test/mock';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([listTransactionMock, 1]),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of transactions', async () => {
    const userId = 'test-user-id';
    const page = 1;
    const limit = 10;

    const result = await service.listTransactions(userId, page, limit);

    expect(result).toEqual({
      data: listTransactionMock,
      totalRecords: listTransactionMock.length,
      currentPage: page,
      pageSize: limit,
      totalPages: 1,
    });
  });
});
