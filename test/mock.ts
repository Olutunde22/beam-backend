export const mockUser = {
  id: '248c5878-e0cc-4897-97e2....',
  fullName: 'Olutunde Beam',
  email: 'olutunde@beam.com',
  password: '2222',
  walletId: 'd98a9a57-1f21-40b0-be59-aaa5caded46a',
  createdAt: '2025-04-08T21:15:02.522Z',
  updatedAt: '2025-04-08T21:15:02.000Z',
};

export const listTransactionMock = [
  {
    id: 'test-user-id',
    type: 'deposit',
    direction: 'credit',
    status: 'successful',
    amount: 10000,
    note: null,
    userId: '5ba10476-f04b-44f1-9159-....',
    createdAt: '2025-04-08T21:43:59.008Z',
    updatedAt: '2025-04-08T21:43:59.008Z',
  },
];

export const mockWallet = {
  id: '123',
  userId: '123',
  bankId: '123',
  balance: 0,
};
