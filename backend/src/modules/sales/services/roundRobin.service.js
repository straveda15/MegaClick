import mongoose from "mongoose";

/**
 * MongoDB-backed round-robin counter.
 *
 * Persists the counter in a "roundrobincounters" collection so that it
 * survives server restarts and works correctly across multiple processes.
 *
 * Each named key tracks an independent counter — so this module can be
 * reused for any future round-robin distribution (e.g. lead assignment).
 *
 * Document shape:
 *   { _id: "contact_round_robin", counter: 7 }
 */

const counterSchema = new mongoose.Schema(
  {
    _id:     { type: String, unique: true },
    counter: { type: Number, default: 0 },
  },
  { versionKey: false }
);

// Guard against model re-registration in hot-reload environments
const RoundRobinCounter =
  mongoose.models.RoundRobinCounter ||
  mongoose.model("RoundRobinCounter", counterSchema);

/**
 * Atomically increments the counter for `key` and returns the index to
 * use in a pool of `total` items.
 *
 * Thread-safe: the $inc is a single atomic MongoDB operation. Concurrent
 * requests cannot land on the same index.
 *
 * @param {string} key   - unique name for this counter (e.g. "contact_round_robin")
 * @param {number} total - pool size (number of recipients / items)
 * @returns {Promise<number>} index in [0, total)
 */
export const nextRoundRobinIndex = async (key, total) => {
  if (total <= 0) return 0;

  // new: false  → returns the document AS IT WAS before the increment.
  // On the very first call (upsert creates the doc), returns null.
  const doc = await RoundRobinCounter.findOneAndUpdate(
    { _id: key },
    { $inc: { counter: 1 } },
    { upsert: true, new: false }
  );

  // doc is null on the first-ever call (created by upsert with counter=1 after this)
  // doc.counter is the value BEFORE the increment on subsequent calls
  const prevCounter = doc?.counter ?? 0;
  return prevCounter % total;
};
