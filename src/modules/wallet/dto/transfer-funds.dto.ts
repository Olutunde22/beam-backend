import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class TransferFundsDto {
  @ApiProperty({ example: 'john.doe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '500000' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 'School fees payment' })
  @IsString()
  @IsOptional()
  note: string;
}
