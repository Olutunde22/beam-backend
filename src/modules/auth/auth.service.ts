import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/src/typeorm/entities/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ISignInPayload, IUserPayload } from '@/src/decorators';
import { ConfigService } from '@nestjs/config';
import { HelperEncryptionService } from '../helper/services/helper.encryption.service';
import { JwtPayload } from './auth.interface';
import { sec } from '@/src/lib/utils';
import { Wallet } from '@/src/typeorm/entities/wallet.model';
import { Bank } from '@/src/typeorm/entities/bank.model';
import * as bcrypt from 'bcrypt';
import { config } from '@/src/config/app.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly helperEncryptionService: HelperEncryptionService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      select: ['password', 'id', 'fullName', 'email'],
    });

    if (!user) {
      throw new NotFoundException('Invalid email/password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new NotFoundException('Invalid email/password');
    }

    return user;
  }

  async register(data: RegisterDto) {
    const user = await this.userRepository.findOne({
      where: { email: data.email.toLowerCase() },
    });

    if (user) {
      throw new NotFoundException('Email already exists');
    }

    const createdUser = await this.userRepository.manager.transaction(
      async (tx: EntityManager) => {
        const bank = await this.bankRepository.find();
        if (!bank || bank.length < 1)
          throw new NotFoundException('No bank found');
        // Create User and wallet
        const user = this.userRepository.create({
          ...data,
          password: await bcrypt.hash(data.password, config.saltRounds),
        });

        await tx.save(user);

        const wallet = this.walletRepository.create({
          userId: user.id,
          bankId: bank[0]?.id,
          balance: 0,
        });

        await tx.save(wallet);
        user.walletId = wallet.id;
        await tx.save(user);
        return user;
      },
    );

    const { accessToken } = await this.getTokens({
      id: createdUser.id,
    });

    const accessTokenExpires = sec(
      this.configService.get('app.accessTokenExpiresIn') as string,
    );

    const now = new Date();

    const accessTokenExpiryDate = new Date(
      now.getTime() + accessTokenExpires * 1000,
    );

    return {
      id: createdUser.id,
      fullName: createdUser.fullName,
      email: createdUser.email,
      walletId: createdUser.walletId,
      accessToken,
      accessTokenExpiresAt: accessTokenExpiryDate.getTime(),
    };
  }

  async login(user: ISignInPayload) {
    const { accessToken } = await this.getTokens({
      id: user.id,
    });

    const accessTokenExpires = sec(
      this.configService.get('app.accessTokenExpiresIn') as string,
    );

    const now = new Date();

    const accessTokenExpiryDate = new Date(
      now.getTime() + accessTokenExpires * 1000,
    );

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      accessToken,
      accessTokenExpiresAt: accessTokenExpiryDate.getTime(),
    };
  }

  async getTokens(body: Omit<IUserPayload, 'iat' | 'exp'>) {
    const cryptoKey = this.configService.get<string>('app.cryptoKey') as string;
    const cryptoIv = this.configService.get<string>('app.cryptoiv') as string;

    const cipher = this.helperEncryptionService.cryptoCipher(
      body,
      cryptoKey,
      cryptoIv,
    );

    const payload: JwtPayload = {
      data: cipher,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.accessTokenSecret'),
      expiresIn: this.configService.get<string>('app.accessTokenExpiresIn'),
    });

    return { accessToken };
  }

  async decodeAccessToken(accessToken: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get<string>('app.accessTokenSecret'),
    });
  }
}
