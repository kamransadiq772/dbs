import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
/**
 * @description AuthN is used for JWT Authentication
 */
export const AuthN = () =>
  applyDecorators(SetMetadata('authenticatedOnly', true), ApiBearerAuth());
