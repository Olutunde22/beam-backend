import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@/typeorm/entities/user.model';
import { Transaction } from '@/typeorm/entities/transaction.model';
import { Wallet } from '@/typeorm/entities/wallet.model';
import { mockUser, mockWallet } from '../../../test/mock';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('WalletService', () => {
  let service: WalletService;
  let walletRepository: Repository<Wallet>;
  let userRepository: Repository<User>;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            manager: {
              transaction: jest
                .fn()
                .mockImplementation(
                  async (cb) => await cb({ save: jest.fn() }),
                ),
            },
          },
        },
        {
          provide: getRepositoryToken(Wallet),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockWallet),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletRepository = module.get<Repository<Wallet>>(
      getRepositoryToken(Wallet),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the current balance for a user', async () => {
    const userId = 'some-user-id';

    const result = await service.getCurrentBalance(userId);

    expect(walletRepository.findOne).toHaveBeenCalledWith({
      where: {
        userId,
      },
    });

    expect(result).toEqual(mockWallet);
  });

  it('should fund the wallet for a user', async () => {
    const userId = 'some-user-id';
    const mockFundWallet = { amount: 50 };

    const result = await service.fundWallet(mockFundWallet, userId);

    expect(walletRepository.findOne).toHaveBeenCalledWith({
      where: {
        userId,
      },
    });

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });

    expect(transactionRepository.create).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ message: 'Successfully funded account.' });
  });

  it('should throw NotFoundException if the user does not exist', async () => {
    const userId = 'some-user-id';
    const mockFundWallet = { amount: 50 };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(service.fundWallet(mockFundWallet, userId)).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.fundWallet(mockFundWallet, userId)).rejects.toThrow(
      'User does not exist',
    );
  });

  it('should throw NotFoundException if the wallet does not exist', async () => {
    const userId = 'some-user-id';
    const mockFundWallet = { amount: 50 };

    jest.spyOn(walletRepository, 'findOne').mockResolvedValue(null);

    await expect(service.fundWallet(mockFundWallet, userId)).rejects.toThrow(
      NotFoundException,
    );
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    await expect(service.fundWallet(mockFundWallet, userId)).rejects.toThrow(
      'User does not have a wallet',
    );
  });
});
