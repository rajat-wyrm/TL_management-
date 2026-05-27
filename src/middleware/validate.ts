import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../common/errors.js';

export function validateBody(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      throw new BadRequestError(result.error.issues.map(i => i.message).join(', '));
    }
    request.body = result.data;
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const result = schema.safeParse(request.query);
    if (!result.success) {
      throw new BadRequestError(result.error.issues.map(i => i.message).join(', '));
    }
    request.query = result.data;
  };
}

export function validateParams(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const result = schema.safeParse(request.params);
    if (!result.success) {
      throw new BadRequestError(result.error.issues.map(i => i.message).join(', '));
    }
    request.params = result.data;
  };
}
