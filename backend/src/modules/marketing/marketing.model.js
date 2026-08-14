import mongoose from "mongoose";

// ── User Sessions ─────────────────────────────────────────────────────────────
const marketingSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true }, // one doc per visit (rotates after 30 min inactivity)
  visitorId: { type: String, index: true }, // persistent per-browser identity for distinct-visitor counts
  userId: { type: String }, // Links to device types 'desktop', 'mobile' from CSV or real user
  utmSource: { type: String },
  utmCampaign: { type: String },
  utmMedium: { type: String },
  utmTerm: { type: String },
  platform: { type: String },
  channel: { type: String },
  device: { type: String },
  location: { type: String },
  landingPage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const MarketingSession = mongoose.model("MarketingSession", marketingSessionSchema);

// ── Events ──────────────────────────────────────────────────────────────────
const marketingEventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  eventType: { type: String, required: true }, // 'page_view', 'add_to_cart', 'purchase'
  eventData: { type: mongoose.Schema.Types.Mixed }, // JSONB payload
  createdAt: { type: Date, default: Date.now },
});

export const MarketingEvent = mongoose.model("MarketingEvent", marketingEventSchema);

// ── Ad Spend ────────────────────────────────────────────────────────────────
const adSpendSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  campaignId: { type: String, required: true },
  campaignName: { type: String },
  date: { type: Date, required: true },
  spend: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  createdAt: { type: Date, default: Date.now },
});

// Enforce unique daily tracking per campaign on a platform
adSpendSchema.index({ platform: 1, campaignId: 1, date: 1 }, { unique: true });

export const AdSpend = mongoose.model("AdSpend", adSpendSchema);

// ── Meta Insights ───────────────────────────────────────────────────────────
const metaInsightSchema = new mongoose.Schema({
  campaignId: { type: String, required: true },
  campaignName: { type: String },
  date: { type: Date, required: true },
  spend: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  reach: { type: Number, default: 0 },
  frequency: { type: Number, default: 0 },
  cpm: { type: Number, default: 0 },
  cpc: { type: Number, default: 0 },
  ctr: { type: Number, default: 0 },
  linkClicks: { type: Number, default: 0 },
  landingViews: { type: Number, default: 0 },
  whatsappMsgs: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  addToCart: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  roas: { type: Number, default: 0 },
  costPerResult: { type: Number, default: 0 },
  primaryResult: { type: Number, default: 0 },
  postEngagement: { type: Number, default: 0 },
  videoViews: { type: Number, default: 0 },
  leads: { type: Number, default: 0 },
});

metaInsightSchema.index({ campaignId: 1, date: 1 }, { unique: true });

export const MetaInsight = mongoose.model("MetaInsight", metaInsightSchema);


// ── Marketing Orders (Isolated for Demo Data) ───────────────────────────────
const marketingOrderSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  externalOrderId: { type: String, unique: true },
  revenue: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  status: { type: String, default: "completed" },
  createdAt: { type: Date, default: Date.now },
});

export const MarketingOrder = mongoose.model("MarketingOrder", marketingOrderSchema);
