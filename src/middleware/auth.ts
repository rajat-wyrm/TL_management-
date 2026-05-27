import { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError, ForbiddenError } from '../common/errors.js';
import { verifyAccessToken } from '../utils/jwt.js';
import redis from '../plugins/redis.js';
import { RoleHierarchy, type UserPayload, type JwtPayload } from '../types/auth.js';
import { Role } from '../types/auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const accessToken = request.cookies.access_token;
  if (!accessToken) {
    throw new UnauthorizedError('Access token missing');
  }

  let payload: JwtPayload;
  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }

  // Check if token is blacklisted
  const isBlacklisted = await redis.get(`blacklist:access:${payload.jti}`);
  if (isBlacklisted) {
    throw new UnauthorizedError('Token has been revoked');
  }

  request.user = {
    id: payload.sub,
    role: payload.role as Role,
    email: '', // will be populated from DB if needed
  };
}

export function authorize(...allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    const userRole = request.user.role;
    const hasPermission = allowedRoles.some(role => RoleHierarchy[userRole] >= RoleHierarchy[role]);
    if (!hasPermission) {
      throw new ForbiddenError('Insufficient permissions');
    }
  };
}
