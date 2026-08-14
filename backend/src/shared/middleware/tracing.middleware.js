import { v4 as uuidv4 } from 'uuid';
import { requestContext } from '../infrastructure/logger.js';

export const tracingMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  
  // Set tracking header back to client
  res.setHeader('x-request-id', requestId);

  requestContext.run({ requestId }, () => {
    next();
  });
};
