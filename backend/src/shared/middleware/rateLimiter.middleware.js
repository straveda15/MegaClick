import rateLimit from 'express-rate-limit';

// Standard API limit (Prevents extreme abuse/loop errors from clients fetching logs)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per windowMs
  standardHeaders: true, 
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please slow down.' }
});

// Mutating APIs limit (Punch Ins, Task State changes, Batch Transitions)
// Prevent scanner / gun glitching
export const mutatingActionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Max 15 state mutations per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Rate limit exceeded for mutating actions.' }
});
