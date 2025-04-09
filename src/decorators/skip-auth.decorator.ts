import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_DECORATOR = 'skipAuth';

export const SkipAuth = () => SetMetadata(SKIP_AUTH_DECORATOR, true);
