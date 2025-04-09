import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestUser, ISignInPayload } from '@/decorators';
import { TransactionDoc } from './transaction.doc';

@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @TransactionDoc()
  listTransactions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @RequestUser() user: ISignInPayload,
  ) {
    return this.transactionsService.listTransactions(user.id, page, limit);
  }
}
