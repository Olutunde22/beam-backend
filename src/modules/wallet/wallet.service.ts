import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Wallet } from '@/src/typeorm/entities/wallet.model';
import { User } from '@/src/typeorm/entities/user.model';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import {
  Transaction,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from '@/src/typeorm/entities/transaction.model';
import { WithdrawFundsDto } from './dto/withdraw-funds.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getCurrentBalance(userId: string) {
    return this.walletRepository.findOne({ where: { userId } });
  }

  async fundWallet(fundWallet: FundWalletDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User does not exist');

    const wallet = await this.walletRepository.findOne({
      where: {
        userId,
      },
    });

    if (!wallet) throw new NotFoundException('User does not have a wallet');

    await this.userRepository.manager.transaction(async (tx: EntityManager) => {
      // use transaction to update wallet and create a transaction history
      const transaction = this.transactionRepository.create({
        type: TransactionType.DEPOSIT,
        direction: TransactionDirection.CREDIT,
        amount: fundWallet.amount,
        userId,
        // ideally there would be stages before successful but because no external api is being called / webhook being listened to we can safely assume success else all will roll back
        status: TransactionStatus.SUCCESSFUL,
      });

      wallet.balance = wallet.balance + fundWallet.amount;

      await tx.save(transaction);
      await tx.save(wallet);

      return wallet;
    });

    return { message: 'Successfully funded account.' };
  }

  async transferFunds(transferFunds: TransferFundsDto, userId: string) {
    const { email } = transferFunds;
    const receiver = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    const sender = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (receiver?.id === sender?.id)
      throw new BadRequestException('Cannot send money to self');

    if (!receiver)
      throw new NotFoundException('User with this email does not exist');

    if (!sender)
      throw new NotFoundException('User with this id does not exist');

    // check if sender has enough money to transfer
    if (sender.wallet.balance < transferFunds.amount)
      throw new ForbiddenException('Insufficient Balance');

    const senderWallet = await this.walletRepository.findOne({
      where: {
        userId: sender.id,
      },
    });

    if (!senderWallet)
      throw new NotFoundException('User does not have a wallet');

    const receiverWallet = await this.walletRepository.findOne({
      where: {
        userId: receiver.id,
      },
    });

    if (!receiverWallet)
      throw new NotFoundException('User does not have a wallet');

    // create transaction to perform 4 operations
    await this.userRepository.manager.transaction(async (tx: EntityManager) => {
      // 1) create a debit record on the sender transaction history
      const debitTransaction = this.transactionRepository.create({
        type: TransactionType.TRANSFER,
        direction: TransactionDirection.DEBIT,
        amount: transferFunds.amount,
        userId: sender.id,
        note: transferFunds.note,
        // ideally there would be stages before successful but because no external api is being called / webhook being listened to we can safely assume success else all will roll back
        status: TransactionStatus.SUCCESSFUL,
      });

      // 2) create a credit record on the receiver transaction history
      const creditTransaction = this.transactionRepository.create({
        type: TransactionType.TRANSFER,
        direction: TransactionDirection.CREDIT,
        amount: transferFunds.amount,
        userId: receiver.id,
        note: transferFunds.note,
        // ideally there would be stages before successful but because no external api is being called / webhook being listened to we can safely assume success else all will roll back
        status: TransactionStatus.SUCCESSFUL,
      });

      // 3) update sender balance
      senderWallet.balance = senderWallet.balance - transferFunds.amount;

      // 4) update receiver balance
      receiverWallet.balance = receiverWallet.balance + transferFunds.amount;

      // save transaction
      await tx.save(debitTransaction);
      await tx.save(creditTransaction);
      await tx.save(senderWallet);
      await tx.save(receiverWallet);

      return senderWallet;
    });

    return { message: 'Successfully transferred funds.' };
  }

  async withdrawFunds(withdrawFunds: WithdrawFundsDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User does not exist');

    const wallet = await this.walletRepository.findOne({
      where: {
        userId,
      },
    });

    if (!wallet) throw new NotFoundException('User does not have a wallet');

    if (wallet.balance < withdrawFunds.amount)
      throw new ForbiddenException('Insufficient Balance');

    await this.userRepository.manager.transaction(async (tx: EntityManager) => {
      // use transaction to update wallet and create a transaction history
      const transaction = this.transactionRepository.create({
        type: TransactionType.WITHDRAWAL,
        direction: TransactionDirection.DEBIT,
        amount: withdrawFunds.amount,
        userId,
        note: withdrawFunds.note,
        // ideally there would be stages before successful but because no external api is being called / webhook being listened to we can safely assume success else all will roll back
        status: TransactionStatus.SUCCESSFUL,
      });

      wallet.balance = wallet.balance - withdrawFunds.amount;

      await tx.save(transaction);
      await tx.save(wallet);

      return wallet;
    });

    return { message: 'Successfully withdrawn funds.' };
  }
}
