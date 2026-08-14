import mongoose from 'mongoose';
import logger from './logger.js';

/**
 * Wraps business logic within a Mongoose session transaction.
 * Ensures atomicity across multiple collections (e.g., Task + Batch + Outbox)
 * @param {Function} executor - Async function to execute containing operations. Passed (session).
 */
export const withTransaction = async (executor) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    const result = await executor(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    logger.warn('Transaction aborted due to error.', { error: error.message });
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
