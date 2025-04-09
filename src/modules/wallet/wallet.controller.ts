import { Controller, Post, Body, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferFundsDto } from './dto/transfer-funds.dto';
import { WithdrawFundsDto } from './dto/withdraw-funds.dto';
import { ISignInPayload, RequestUser } from '@/src/decorators';
import {
  BalanceDoc,
  FundWalletDoc,
  TransferFundsDoc,
  WithdrawFundsDoc,
} from './wallet.doc';

@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/fund')
  @FundWalletDoc()
  fundWallet(
    @Body() fundWallet: FundWalletDto,
    @RequestUser() user: ISignInPayload,
  ) {
    return this.walletService.fundWallet(fundWallet, user.id);
  }

  @Get('/balance')
  @BalanceDoc()
  getCurrentBalance(@RequestUser() user: ISignInPayload) {
    return this.walletService.getCurrentBalance(user.id);
  }

  @Post('/transfer')
  @TransferFundsDoc()
  transferFunds(
    @Body() transferFunds: TransferFundsDto,
    @RequestUser() user: ISignInPayload,
  ) {
    return this.walletService.transferFunds(transferFunds, user.id);
  }

  @Post('/withdraw')
  @WithdrawFundsDoc()
  withdrawFunds(
    @Body() withdrawFunds: WithdrawFundsDto,
    @RequestUser() user: ISignInPayload,
  ) {
    return this.walletService.withdrawFunds(withdrawFunds, user.id);
  }
}
