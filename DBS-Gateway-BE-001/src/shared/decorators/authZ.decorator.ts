import { applyDecorators, SetMetadata } from '@nestjs/common';
import { AuthN } from './authN.decorator';
/**
 * @description AuthZ is used for Role-based Authorization
 */
export const AuthZ = (permission: string) => {
  return applyDecorators(AuthN(), SetMetadata('authorizedOnly', true), SetMetadata('permissionName', permission));
};
