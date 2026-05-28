import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(error: any, request: FastifyRequest, reply: FastifyReply) {
  var statusCode = error.statusCode || 500;
  var message = error.message || 'Internal server error';
  if (error.validation) { statusCode = 400; message = error.message; }
  if (error.code === 'P2002') { statusCode = 409; message = 'Record already exists'; }
  if (error.code === 'FST_ERR_CTP_INVALID_MEDIA_TYPE') { statusCode = 415; message = 'Unsupported Media Type'; }
  request.log.error({ err: error, url: request.url, method: request.method }, message);
  reply.status(statusCode).send({ success: false, message: message, code: error.code || 'ERR' });
}
