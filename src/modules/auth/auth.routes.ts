import { authService } from './auth.service.js';
import { validateBody } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schema.js';

export async function authRoutes(app: any) {
  app.post('/register', { preHandler: [validateBody(registerSchema)] }, async function(req: any, reply: any) {
    var r = await authService.register(req.body);
    reply.status(201).send({ success: true, data: r });
  });

  app.post('/login', { preHandler: [validateBody(loginSchema)] }, async function(req: any, reply: any) {
    var result = await authService.login(req.body, req.ip);
    reply.setCookie('access_token', result.accessToken, { httpOnly: true, secure: false, sameSite: 'strict', path: '/', maxAge: 900 });
    reply.setCookie('refresh_token', result.refreshToken, { httpOnly: true, secure: false, sameSite: 'strict', path: '/', maxAge: 604800 });
    reply.send({ success: true, data: { user: result.user } });
  });

  app.post('/refresh', async function(req: any, reply: any) {
    var token = (req.body && req.body.refreshToken) || req.cookies.refresh_token;
    if (!token) return reply.status(400).send({ success: false, message: 'Refresh token required' });
    var tokens = await authService.refreshToken(token);
    reply.setCookie('access_token', tokens.accessToken, { httpOnly: true, secure: false, sameSite: 'strict', path: '/', maxAge: 900 });
    reply.setCookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: false, sameSite: 'strict', path: '/', maxAge: 604800 });
    reply.send({ success: true });
  });

  app.get('/me', { preHandler: [authenticate] }, async function(req: any, reply: any) {
    var u = await authService.getCurrentUser(req.user.id);
    reply.send({ success: true, data: u });
  });

  app.put('/change-password', { preHandler: [authenticate, validateBody(changePasswordSchema)] }, async function(req: any, reply: any) {
    await authService.changePassword(req.user.id, req.body);
    reply.send({ success: true, message: 'Password changed successfully' });
  });

  app.post('/forgot-password', { preHandler: [validateBody(forgotPasswordSchema)] }, async function(req: any, reply: any) {
    await authService.forgotPassword(req.body.email);
    reply.send({ success: true, message: 'If email exists, reset link sent' });
  });

  app.post('/reset-password', { preHandler: [validateBody(resetPasswordSchema)] }, async function(req: any, reply: any) {
    await authService.resetPassword(req.body);
    reply.send({ success: true, message: 'Password reset successfully' });
  });

  app.post('/logout', { preHandler: authenticate }, async function(req: any, reply: any) {
    await authService.logout(req.user.id, req.cookies.refresh_token);
    reply.clearCookie('access_token', { path: '/' });
    reply.clearCookie('refresh_token', { path: '/' });
    reply.send({ success: true, message: 'Logged out' });
  });
}
