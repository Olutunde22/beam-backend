import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class FundWalletDto {
  @ApiProperty({ example: '500000' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;
}
