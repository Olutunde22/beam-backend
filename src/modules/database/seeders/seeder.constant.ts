import { Bank } from '@/src/typeorm/entities/bank.model';
import { v4 } from 'uuid';

export const banks: Partial<Bank>[] = [
  {
    id: v4(),
    name: 'Wema Bank',
    code: 'WEMA',
  },
  {
    id: v4(),
    name: 'Guaranteed Trust Bank',
    code: 'GTB',
  },
];
