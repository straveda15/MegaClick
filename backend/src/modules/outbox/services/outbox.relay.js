import OutboxEvent from '../models/outboxEvent.model.js';
import { routeEventToQueue } from '../../../shared/infrastructure/queue.js';
import logger from '../../../shared/infrastructure/logger.js';

/**
 * Robust Polling mechanism utilizing Atomic Database Locking.
 * Replaces the brittle limit(50) blind fetch which causes duplicates when scaled horizontally.
 */
export const processPendingOutboxEvents = async () => {
  const BATCH_SIZE = 50;
  const LOCK_DURATION_MS = 30000; // 30 seconds
  const now = new Date();
  let processedCount = 0;

  try {
    for (let i = 0; i < BATCH_SIZE; i++) {
      // 1. Atomic Locked Read
      // Finds a pending event, OR an event that was locked but the worker crashed before releasing it (lockedUntil < now)
      const event = await OutboxEvent.findOneAndUpdate(
        {
          $or: [
            { status: 'pending' },
            { status: 'processing', lockedUntil: { $lte: now }, attempts: { $lt: 5 } } // Auto unlock dead processing
          ]
        },
        {
          $set: { 
            status: 'processing',
            lockedUntil: new Date(now.getTime() + LOCK_DURATION_MS)
          }
        },
        { new: true, sort: { createdAt: 1 } } // FIFO
      );

      if (!event) break; // No more events to process

      // 2. Safely Process
      try {
        await routeEventToQueue(event.eventType, event.payload, event._id);
        
        // 3. Mark processed securely
        await OutboxEvent.updateOne(
          { _id: event._id },
          { $set: { status: 'processed', lockedUntil: null } }
        );
        processedCount++;
      } catch (err) {
        logger.error(`Outbox routing failed for event ${event._id}`, { error: err.message });
        
        const isDeadLetter = event.attempts >= 4; // Moves to DLQ essentially by stopping retries
        
        // Setup exponential backoff for the lock manually
        const backoffMs = Math.pow(2, event.attempts) * 2000; 

        await OutboxEvent.updateOne(
          { _id: event._id },
          { 
            $set: { 
              status: isDeadLetter ? 'failed' : 'pending', // Revert to pending for retry, unless DLQ
              failedReason: err.message,
              lockedUntil: isDeadLetter ? null : new Date(Date.now() + backoffMs) 
            },
            $inc: { attempts: 1 }
          }
        );
      }
    }
    
    if (processedCount > 0) {
      logger.info(`Outbox sweep completed successfully. Processed ${processedCount} events.`);
    }
  } catch (error) {
    logger.error('Critical Outbox Relay Exception (Database swept error)', { error: error.message });
  }
};
