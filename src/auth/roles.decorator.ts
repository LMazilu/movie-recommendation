import { SetMetadata } from '@nestjs/common';

export const IsAdmin = (isAdmin: boolean) => SetMetadata('isAdmin', isAdmin);
