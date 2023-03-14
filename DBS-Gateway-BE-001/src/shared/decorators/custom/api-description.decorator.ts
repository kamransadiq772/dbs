import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
/**
 * @description ApiDescription adds description to the route
 */
export const ApiDescription = (description: string) =>
  applyDecorators(ApiOperation({ description }));
