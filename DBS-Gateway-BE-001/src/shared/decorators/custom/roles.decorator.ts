import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Role } from '../../../interfaces/role';
import { AuthZ } from '../authZ.decorator';
/**
 * @description ApiDescription adds description to the route
 */
export const Permission = (permission: string) =>
    applyDecorators(AuthZ(permission), ApiOperation({ summary: permission || '' }));
