import { AsyncLocalStorage } from 'async_hooks';
import winston from 'winston';

export const requestContext = new AsyncLocalStorage();

const formatWithContext = winston.format((info) => {
  const store = requestContext.getStore();
  if (store && store.requestId) {
    info.requestId = store.requestId;
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    formatWithContext(),
    winston.format.json()
  ),
  defaultMeta: { service: 'everlive-operations-api' },
  transports: [
    new winston.transports.Console()
    // Add Datadog/CloudWatch transport in production
  ]
});

export default logger;
