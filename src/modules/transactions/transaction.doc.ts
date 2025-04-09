import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const TransactionDoc = (): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved current user transactions.',
      schema: {
        example: {
          statusCode: 200,
          message: 'OK',
          success: true,
          data: {
            data: [
              {
                id: 'dd5f790a-dd9f-408e-889a-c9bf51d81592',
                type: 'deposit',
                direction: 'credit',
                status: 'successful',
                amount: 10000,
                note: null,
                userId: '5ba10476-f04b-44f1-9159-....',
                createdAt: '2025-04-08T21:43:59.008Z',
                updatedAt: '2025-04-08T21:43:59.008Z',
              },
            ],
            totalRecords: 1,
            currentPage: 1,
            pageSize: 2,
            totalPages: 1,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        example: {
          statusCode: 400,
          message: [],
          success: false,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid token',
          success: false,
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Something went wrong',
      schema: {
        example: {
          statusCode: 500,
          message: 'Something went wrong',
          success: false,
        },
      },
    }),
  );
};
