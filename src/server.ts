import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import config from './config/index.js';
import { connectDB, disconnectDB } from './db/pool.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './modules/auth/auth.routes.js';

async function buildApp() {
  const app = Fastify({ logger: { level: 'debug', transport: { target: 'pino-pretty' } } });
  await app.register(helmet);
  await app.register(cors, { origin: true, credentials: true });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  await app.register(cookie, { secret: config.CSRF_SECRET });
  await app.register(swagger, { openapi: { info: { title: 'TL API', version: '1.0.0' } } });
  await app.register(swaggerUi, { routePrefix: '/docs' });
  app.setErrorHandler(errorHandler);
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.get('/api/v1/health', async () => ({ status: 'ok', db: 'Neon PostgreSQL' }));
  app.addHook('onClose', async () => { await disconnectDB(); });
  await connectDB();
  return app;
}

async function start() {
  const app = await buildApp();
  try { await app.listen({ port: config.PORT, host: '0.0.0.0' }); console.log('Server: http://localhost:' + config.PORT); }
  catch(err) { app.log.error(err); process.exit(1); }
}
start();
