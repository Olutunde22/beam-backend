import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class WithdrawFundsDto {
  @ApiProperty({ example: '500000' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 'House rent' })
  @IsString()
  @IsOptional()
  note: string;
}
