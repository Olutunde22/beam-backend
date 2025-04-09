import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const UserDoc = (): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved current user.',
      schema: {
        example: {
          statusCode: 201,
          message: 'OK',
          success: true,
          data: {
            id: '248c5878-e0cc-4897-97e2....',
            fullName: 'Olutunde Beam',
            email: 'olutunde@beam.com',
            walletId: 'd98a9a57-1f21-40b0-be59-aaa5caded46a',
            createdAt: '2025-04-08T21:15:02.522Z',
            updatedAt: '2025-04-08T21:15:02.000Z',
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiVTJGc2RHVmtYMStoMnBHeThLdWM3UEJJQXcwUGdnOUlFbzRBTGZMSmVEb29KVHlx....',
            accessTokenExpiresAt: 1744236902645,
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
