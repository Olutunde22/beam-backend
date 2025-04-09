import { BadRequestException, ValidationError } from '@nestjs/common';

const transform = (errors: ValidationError[]): string[] => {
  return errors
    .map((error) => (error.constraints ? Object.values(error.constraints) : []))
    .flat();
};

export class ValidationExceptions extends BadRequestException {
  constructor(private readonly validationErrors: ValidationError[]) {
    super({
      statusCode: 400,
      messages: transform(validationErrors),
      error: 'ValidationError',
    });
  }
}
