import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '@/typeorm/entities/user.model';
import { mockUser } from '../../../test/mock';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('should return the user when found', async () => {
      const userId = '1';
      const user = await service.getCurrentUser(userId);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const userId = '2';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getCurrentUser(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
