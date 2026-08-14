import { createClient } from 'redis';
import logger from '../infrastructure/logger.js';

// Global Singleton Redis (assuming initialization in server.js)
export const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

redisClient.on('error', (err) => logger.error('Redis Client Error', { err }));
// Initialize intentionally omitted here to prevent crashing during build test

export const idempotencyMiddleware = async (req, res, next) => {
  if (['GET', 'OPTIONS'].includes(req.method)) {
    return next(); // Safe methods do not mutate
  }

  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) {
    // We can strictly enforce it, or allow missing keys with a warning
    logger.warn('Mutating request missing idempotency-key header');
    return next();
  }

  const cacheKey = `idempotency:${req.user?._id || 'global'}:${idempotencyKey}`;
  
  try {
    if (!redisClient.isOpen) await redisClient.connect();

    const cachedResponseStr = await redisClient.get(cacheKey);
    if (cachedResponseStr) {
      logger.info('Returning cached response for identical idempotency key');
      const cachedResponse = JSON.parse(cachedResponseStr);
      return res.status(cachedResponse.statusCode).json(cachedResponse.body);
    }

    // Wrap res.json to cache it upon downstream execution completeness
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Background cache setting
      redisClient.setEx(cacheKey, 86400, JSON.stringify({ statusCode: res.statusCode, body }))
        .catch(err => logger.error('Idempotency Redis write failed', { err }));
      
      return originalJson(body);
    };

    next();
  } catch (err) {
    logger.error('Idempotency Middleware exception', { err });
    next(); // Fallback to normal execution if redis drops
  }
};
