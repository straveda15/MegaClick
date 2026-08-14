import mongoose from "mongoose";

/**
 * Singleton configuration for the sales tracker. Currently holds the lead
 * distribution roster — the set of sales members among whom open/new leads are
 * automatically split equally (every 30 min and on demand). On-leave / inactive
 * members are filtered out at read time, not removed from the roster, so they
 * rejoin automatically once they are back.
 */
const salesConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "singleton",
      unique: true,
    },
    rosterMemberIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const SalesConfig = mongoose.model("SalesConfig", salesConfigSchema);

/**
 * Fetch (creating if missing) the single config document.
 */
export const getSalesConfig = async () => {
  let cfg = await SalesConfig.findOne({ key: "singleton" });
  if (!cfg) cfg = await SalesConfig.create({ key: "singleton", rosterMemberIds: [] });
  return cfg;
};

/**
 * Persist the distribution roster.
 */
export const setSalesRoster = async (memberIds, updatedBy) => {
  const cfg = await getSalesConfig();
  cfg.rosterMemberIds = memberIds;
  if (updatedBy) cfg.updatedBy = updatedBy;
  await cfg.save();
  return cfg;
};

export default SalesConfig;
