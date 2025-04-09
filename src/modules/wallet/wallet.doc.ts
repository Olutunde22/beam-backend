import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const BalanceDoc = (): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved current user balance.',
      schema: {
        example: {
          statusCode: 200,
          message: 'OK',
          success: true,
          data: {
            id: '2985fecf-bd0a-419d-bcf3-dddd',
            userId: '5ba10476-f04b-44f1-9159-dddd',
            bankId: '0fd45b55-be09-4908-8183-ddddd',
            balance: 0,
            bank: {
              id: '0fd45b55-be09-4908-8183-ddddd',
              name: 'Guaranteed Trust Bank',
              code: 'GTB',
              createdAt: '2025-04-08T21:36:10.082Z',
              updatedAt: '2025-04-08T21:36:10.082Z',
            },
            createdAt: '2025-04-08T21:36:50.130Z',
            updatedAt: '2025-04-08T21:36:50.130Z',
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

export const FundWalletDoc = (): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Successfully funded account.',
      schema: {
        example: {
          statusCode: 201,
          message: 'OK',
          success: true,
          data: {
            message: 'Successfully funded account.',
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

export const WithdrawFundsDoc = (): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Successfully withdrawn funds.',
      schema: {
        example: {
          statusCode: 201,
          message: 'OK',
          success: true,
          data: {
            message: 'Successfully withdrawn funds.',
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

export const TransferFundsDoc = (): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Successfully transferred funds',
      schema: {
        example: {
          statusCode: 201,
          message: 'OK',
          success: true,
          data: {
            message: 'Successfully transferred funds',
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
