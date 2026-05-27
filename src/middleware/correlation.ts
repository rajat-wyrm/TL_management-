import { randomUUID } from 'crypto';

export async function correlationId(request: any, reply: any) {
  var id = request.headers['x-correlation-id'] || request.headers['x-request-id'] || randomUUID();
  request.correlationId = id;
  reply.header('x-correlation-id', id);
}
