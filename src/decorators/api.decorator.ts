import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function BasicApiResponse() {
  return applyDecorators(
    ApiOkResponse({ description: 'success' }),
    ApiCreatedResponse({ description: 'success new data' }),
    ApiUnauthorizedResponse({ description: 'invalid token' }),
    ApiInternalServerErrorResponse({ description: 'server error' }),
  );
}
