import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const RegisterDoc = (): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Successfully retrieved current user.',
      schema: {
        example: {
          statusCode: 201,
          message: 'OK',
          success: true,
          data: {
            id: 'ee9dbd81-5910-4975-b083-dindondo',
            fullName: 'Olutunde Solabi',
            email: 'john.doe123s@gmail.com',
            walletId: 'e197485f-fb18-4ee8-97f1-17jndindodd',
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiVTJGc2RHVmtYMS8wR29VZUpqU0tTaFFIbzRzM2tybWlSUmhTNXVNVk90RTZjY2lkO...',
            accessTokenExpiresAt: 1744237191922,
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

export const LoginDoc = (): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Successfully retrieved current user.',
      schema: {
        example: {
          statusCode: 201,
          message: 'OK',
          success: true,
          data: {
            id: 'ee9dbd81-5910-4975-b083-dindondo',
            fullName: 'Olutunde Solabi',
            email: 'john.doe123s@gmail.com',
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiVTJGc2RHVmtYMS8wR29VZUpqU0tTaFFIbzRzM2tybWlSUmhTNXVNVk90RTZjY2lkO...',
            accessTokenExpiresAt: 1744237191922,
          },
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
