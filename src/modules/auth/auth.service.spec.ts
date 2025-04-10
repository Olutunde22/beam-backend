import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@/typeorm/entities/user.model';
import { Wallet } from '@/typeorm/entities/wallet.model';
import { Bank } from '@/typeorm/entities/bank.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HelperEncryptionService } from '../helper/services/helper.encryption.service';
import { Repository } from 'typeorm';
import { mockUser } from '../../../test/mock';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  const mockWallet = { id: 1, userId: 1, bankId: 1, balance: 0 };
  const mockBank = [{ id: 1, name: 'Test Bank' }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockReturnValue(mockUser),
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
            create: jest.fn().mockReturnValue(mockWallet),
          },
        },
        {
          provide: getRepositoryToken(Bank),
          useValue: {
            find: jest.fn().mockResolvedValue(mockBank),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockAccessToken'),
            verifyAsync: jest.fn().mockResolvedValue({ data: 'mockData' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'app.accessTokenSecret') return 'secret';
              if (key === 'app.accessTokenExpiresIn') return '3600';
              if (key === 'app.cryptoKey') return 'cryptoKey';
              if (key === 'app.cryptoiv') return 'cryptoIv';
            }),
          },
        },
        {
          provide: HelperEncryptionService,
          useValue: {
            cryptoCipher: jest.fn().mockReturnValue('cipheredData'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user successfully', async () => {
    const registerDto = {
      email: 'newuser@example.com',
      password: 'password',
      fullName: 'New User',
    };
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    const user = await service.register(registerDto);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('accessToken');
  });

  it('should throw NotFoundException for existing email during registration', async () => {
    await expect(
      service.register({
        email: 'test@example.com',
        password: 'password',
        fullName: 'Test User',
      }),
    ).rejects.toThrow('Email already exists');
  });

  it('should login a user successfully', async () => {
    const user = await service.login(mockUser);
    expect(user).toHaveProperty('accessToken');
  });
});
