import { MarketingSession, MarketingEvent, AdSpend, MetaInsight, MarketingOrder } from "./marketing.model.js";
// import { syncGoogleAdsSpend } from "./integrations/googleAds.js";
import { syncMetaAdsSpend } from "./integrations/metaAds.js";



// Helper to handle empty async results
const firstOrZero = (arr, fields) => {
  const defaults = {};
  fields.forEach(f => defaults[f] = 0);
  return arr.length > 0 ? arr[0] : defaults;
};

// ── Dashboard KPIs ────────────────────────────────────────────────────────────

export async function getDashboardKpis(startDate, endDate) {
  const match = {};
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const [meta] = await MetaInsight.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        spend: { $sum: "$spend" },
        clicks: { $sum: "$linkClicks" },
        impressions: { $sum: "$impressions" },
        reach: { $sum: "$reach" },
        revenue: { $sum: "$revenue" },
        purchases: { $sum: "$purchases" },
        leads: { $sum: "$leads" },
        wa_msgs: { $sum: "$whatsappMsgs" },
        add_to_cart: { $sum: "$addToCart" },
        landing_views: { $sum: "$landingViews" },
        post_engagement: { $sum: "$postEngagement" },
        video_views: { $sum: "$videoViews" },
      }
    }
  ]);

  if (!meta) {
    // Fall back to AdSpend if MetaInsight is empty
    const spendMatch = {};
    if (startDate || endDate) {
      spendMatch.date = {};
      if (startDate) spendMatch.date.$gte = new Date(startDate);
      if (endDate) spendMatch.date.$lte = new Date(endDate);
    }
    const [spRaw] = await AdSpend.aggregate([
      { $match: spendMatch },
      { $group: { _id: null, spend: { $sum: "$spend" }, clicks: { $sum: "$clicks" }, imps: { $sum: "$impressions" } } }
    ]);
    const sp = spRaw || { spend: 0, clicks: 0, imps: 0 };
    return {
      total_ad_spend: sp.spend, total_revenue: 0, total_purchases: 0,
      total_leads: 0, total_wa_msgs: 0, total_add_to_cart: 0, total_reach: 0,
      total_landing_views: 0, total_post_engagement: 0, total_video_views: 0,
      roas: 0, cost_per_purchase: 0, cost_per_result: 0,
      total_clicks: sp.clicks, total_impressions: sp.imps,
      ctr: 0, cpc: 0, cpm: 0, profit: -sp.spend, profit_margin: 0,
    };
  }

  const spend = meta.spend || 0;
  const clicks = meta.clicks || 0;
  const impressions = meta.impressions || 0;
  const revenue = meta.revenue || 0;
  const purchases = meta.purchases || 0;
  const leads = meta.leads || 0;
  const wa = meta.wa_msgs || 0;

  const roas = spend > 0 && revenue > 0 ? Math.round((revenue / spend) * 100) / 100 : 0;
  const ctr = impressions > 0 ? Math.round((clicks / impressions * 100) * 10000) / 10000 : 0;
  const cpc = clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0;
  const cpm = impressions > 0 ? Math.round((spend / impressions * 1000) * 100) / 100 : 0;
  const cpp = purchases > 0 ? Math.round((spend / purchases) * 100) / 100 : 0;
  const primary = wa || leads || purchases;
  const cpr = primary > 0 ? Math.round((spend / primary) * 100) / 100 : 0;
  const profit = Math.round((revenue - spend) * 100) / 100;
  const margin = revenue > 0 ? Math.round((profit / revenue * 100) * 10) / 10 : 0;

  return {
    total_ad_spend: spend,
    total_revenue: revenue,
    total_purchases: purchases,
    total_leads: leads,
    total_wa_msgs: wa,
    total_add_to_cart: meta.add_to_cart || 0,
    total_reach: meta.reach || 0,
    total_landing_views: meta.landing_views || 0,
    total_post_engagement: meta.post_engagement || 0,
    total_video_views: meta.video_views || 0,
    roas,
    cost_per_purchase: cpp,
    cost_per_result: cpr,
    total_clicks: clicks,
    total_impressions: impressions,
    ctr,
    cpc,
    cpm,
    profit,
    profit_margin: margin,
  };
}

// ── Timeseries ────────────────────────────────────────────────────────────────

export async function getSpendRevenueTimeseriesFixed(startDate, endDate) {
  const match = {};
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  // Primary: MetaInsight has both spend and revenue per day
  const metaRows = await MetaInsight.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        spend: { $sum: "$spend" },
        revenue: { $sum: "$revenue" },
        clicks: { $sum: "$linkClicks" },
        impressions: { $sum: "$impressions" },
        purchases: { $sum: "$purchases" },
      }
    },
    { $sort: { _id: 1 } }
  ]);

  if (metaRows.length > 0) {
    return metaRows.map(row => ({
      date: row._id,
      spend: row.spend || 0,
      revenue: row.revenue || 0,
      profit: Math.round(((row.revenue || 0) - (row.spend || 0)) * 100) / 100,
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      purchases: row.purchases || 0,
    }));
  }

  // Fallback: AdSpend only (no revenue)
  const spendRows = await AdSpend.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        spend: { $sum: "$spend" },
        clicks: { $sum: "$clicks" },
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return spendRows.map(row => ({
    date: row._id,
    spend: row.spend || 0,
    revenue: 0,
    profit: -(row.spend || 0),
    clicks: row.clicks || 0,
    impressions: 0,
    purchases: 0,
  }));
}

export const getSpendRevenueTimeseries = getSpendRevenueTimeseriesFixed;

// ── Meta Daily Timeseries (all engagement metrics per day) ────────────────────

export async function getMetaTimeseries(startDate, endDate) {
  const match = {};
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const rows = await MetaInsight.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        spend: { $sum: "$spend" },
        clicks: { $sum: "$linkClicks" },
        impressions: { $sum: "$impressions" },
        reach: { $sum: "$reach" },
        purchases: { $sum: "$purchases" },
        leads: { $sum: "$leads" },
        wa_msgs: { $sum: "$whatsappMsgs" },
        add_to_cart: { $sum: "$addToCart" },
        landing_views: { $sum: "$landingViews" },
        video_views: { $sum: "$videoViews" },
        revenue: { $sum: "$revenue" },
        cpm: { $avg: "$cpm" },
        cpc: { $avg: "$cpc" },
        ctr: { $avg: "$ctr" },
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return rows.map(row => ({
    date: row._id,
    spend: row.spend || 0,
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    reach: row.reach || 0,
    purchases: row.purchases || 0,
    leads: row.leads || 0,
    wa_msgs: row.wa_msgs || 0,
    add_to_cart: row.add_to_cart || 0,
    landing_views: row.landing_views || 0,
    video_views: row.video_views || 0,
    revenue: row.revenue || 0,
    cpm: Math.round((row.cpm || 0) * 100) / 100,
    cpc: Math.round((row.cpc || 0) * 100) / 100,
    ctr: Math.round((row.ctr || 0) * 100) / 100,
  }));
}

// ── Campaign Performance ──────────────────────────────────────────────────────

export async function getCampaignPerformance() {
  const spendRows = await AdSpend.aggregate([
    {
      $group: {
        _id: { campaignName: "$campaignName", platform: "$platform" },
        spend: { $sum: "$spend" },
        clicks: { $sum: "$clicks" },
        impressions: { $sum: "$impressions" }
      }
    }
  ]);

  const spendMap = {};
  spendRows.forEach(row => {
    const camp = row._id.campaignName || "Unknown Campaign";
    const ctr = row.impressions > 0 ? (row.clicks / row.impressions) * 100 : 0;
    spendMap[camp] = {
      spend: row.spend,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: Math.round(ctr * 100) / 100,
      platform: row._id.platform
    };
  });

  const revRows = await MarketingSession.aggregate([
    { $match: { utmCampaign: { $ne: null } } },
    {
      $lookup: {
        from: "marketingorders", // Mongoose pluralizes collection names
        localField: "sessionId",
        foreignField: "sessionId",
        as: "orders"
      }
    },
    { $unwind: "$orders" },
    { $match: { "orders.status": "completed" } },
    {
      $group: {
        _id: "$utmCampaign",
        conversions: { $count: {} },
        revenue: { $sum: "$orders.revenue" }
      }
    }
  ]);

  const revMap = {};
  revRows.forEach(row => {
    revMap[row._id] = { conversions: row.conversions, revenue: row.revenue };
  });

  const allCampaigns = new Set([...Object.keys(spendMap), ...Object.keys(revMap)]);
  const results = [];
  for (const camp of allCampaigns) {
    const s = spendMap[camp] || { spend: 0, clicks: 0, impressions: 0, ctr: 0, platform: null };
    const r = revMap[camp] || { conversions: 0, revenue: 0 };
    const roas = s.spend > 0 ? Math.round((r.revenue / s.spend) * 100) / 100 : 0;
    results.push({
      campaign: camp,
      platform: s.platform,
      spend: s.spend,
      clicks: s.clicks,
      impressions: s.impressions,
      ctr: s.ctr,
      conversions: r.conversions,
      revenue: r.revenue,
      roas,
    });
  }
  results.sort((a, b) => b.spend - a.spend);
  return results;
}

// ── Conversion Funnel ─────────────────────────────────────────────────────────

export async function getConversionFunnel() {
  const sessionsCount = await MarketingSession.countDocuments();
  const atcRows = await MarketingEvent.aggregate([
    { $match: { eventType: "add_to_cart" } },
    { $group: { _id: "$sessionId" } },
    { $count: "cnt" }
  ]);
  const ordersCount = await MarketingOrder.countDocuments({ status: "completed" });

  const totalSessions = sessionsCount;
  const totalAtc = atcRows.length > 0 ? atcRows[0].cnt : 0;
  const totalOrders = ordersCount;

  return [
    { stage: "Sessions", value: totalSessions, pct: 100 },
    { stage: "Add to Cart", value: totalAtc, pct: totalSessions > 0 ? Math.round((totalAtc / totalSessions) * 1000) / 10 : 0 },
    { stage: "Purchases", value: totalOrders, pct: totalSessions > 0 ? Math.round((totalOrders / totalSessions) * 1000) / 10 : 0 },
  ];
}

// ── Device Breakdown ──────────────────────────────────────────────────────────

export async function getDeviceBreakdown() {
  const rows = await MarketingSession.aggregate([
    { $match: { device: { $nin: [null, ""] } } },
    {
      $lookup: {
        from: "marketingorders",
        localField: "sessionId",
        foreignField: "sessionId",
        as: "orders"
      }
    },
    { $unwind: "$orders" },
    { $match: { "orders.status": "completed" } },
    {
      $group: {
        _id: "$device",
        orders: { $count: {} },
        revenue: { $sum: "$orders.revenue" },
        aov: { $avg: "$orders.revenue" }
      }
    },
    { $sort: { revenue: -1 } }
  ]);

  if (!rows.length) return [];

  const [spRaw] = await AdSpend.aggregate([{ $group: { _id: null, s: { $sum: "$spend" } } }]);
  const totalSpend = spRaw ? spRaw.s : 0;
  const totalRevenue = rows.reduce((sum, r) => sum + r.revenue, 0);

  return rows.map(row => {
    const rev = row.revenue || 0;
    const revShare = totalRevenue > 0 ? rev / totalRevenue : 0;
    const spend = Math.round(totalSpend * revShare * 100) / 100;
    const roas = spend > 0 ? Math.round((rev / spend) * 100) / 100 : 0;
    return {
      device: row._id || "unknown",
      orders: row.orders,
      revenue: rev,
      spend,
      roas,
      aov: row.aov || 0,
    };
  });
}

// ── Keyword Performance ───────────────────────────────────────────────────────

export async function getKeywordPerformance() {
  const rows = await MarketingEvent.aggregate([
    { $match: { eventType: "page_view", "eventData.keyword": { $nin: [null, ""] } } },
    {
      $lookup: {
        from: "marketingorders",
        localField: "sessionId",
        foreignField: "sessionId",
        as: "orders"
      }
    },
    {
      $group: {
        _id: "$eventData.keyword",
        sessions: { $addToSet: "$sessionId" },
        clicks: { $max: "$eventData.clicks" },
        orders: { $push: "$orders" }
      }
    }
  ]);

  const results = rows.map(row => {
    // Flatten orders array of arrays
    const flatOrders = row.orders.flat().filter(o => o.status === "completed");
    // Unique conversions
    const uniqueOrders = new Set(flatOrders.map(o => o._id.toString()));
    const revenue = flatOrders.reduce((sum, o) => sum + o.revenue, 0);
    const clicks = row.clicks || 0;
    const convs = uniqueOrders.size;

    return {
      keyword: row._id,
      sessions: row.sessions.length,
      conversions: convs,
      revenue: revenue,
      clicks: clicks,
      cvr: clicks > 0 ? Math.round((convs / clicks * 100) * 100) / 100 : 0,
      rpc: clicks > 0 ? Math.round((revenue / clicks) * 10000) / 10000 : 0,
    };
  });

  return results.sort((a, b) => b.revenue - a.revenue);
}

export const getFullCampaignMetrics = getCampaignPerformance;

// ── Meta KPIs v2 ──────────────────────────────────────────────────────────────

export async function getMetaKpisV2(startDate, endDate) {
  const match = {};
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const [row] = await MetaInsight.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total_spend: { $sum: "$spend" },
        total_link_clicks: { $sum: "$linkClicks" },
        total_impressions: { $sum: "$impressions" },
        total_reach: { $sum: "$reach" },
        total_revenue: { $sum: "$revenue" },
        total_purchases: { $sum: "$purchases" },
        total_leads: { $sum: "$leads" },
        total_add_to_cart: { $sum: "$addToCart" },
        total_wa_msgs: { $sum: "$whatsappMsgs" },
        total_landing_views: { $sum: "$landingViews" },
        total_engagement: { $sum: "$postEngagement" },
        total_video_views: { $sum: "$videoViews" },
        avg_cpm: { $avg: "$cpm" },
        avg_frequency: { $avg: "$frequency" },
        campaigns: { $addToSet: "$campaignName" }
      }
    }
  ]);

  if (!row) return {};

  const spend = row.total_spend || 0;
  const linkClicks = row.total_link_clicks || 0;
  const imps = row.total_impressions || 0;
  const revenue = row.total_revenue || 0;
  const purchases = row.total_purchases || 0;
  const leads = row.total_leads || 0;
  const wa = row.total_wa_msgs || 0;
  const atc = row.total_add_to_cart || 0;

  const roas = spend > 0 && revenue > 0 ? Math.round((revenue / spend) * 100) / 100 : 0;
  const ctr = imps > 0 ? Math.round((linkClicks / imps * 100) * 100) / 100 : 0;
  const cpc = linkClicks > 0 ? Math.round((spend / linkClicks) * 100) / 100 : 0;
  const cpl = leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0;
  const cpa = purchases > 0 ? Math.round((spend / purchases) * 100) / 100 : 0;
  const primary = wa || leads || purchases;
  const cpr = primary > 0 ? Math.round((spend / primary) * 100) / 100 : 0;

  return {
    total_spend: spend,
    total_link_clicks: linkClicks,
    total_impressions: imps,
    total_reach: row.total_reach || 0,
    total_campaigns: row.campaigns ? row.campaigns.length : 0,
    total_revenue: revenue,
    total_purchases: purchases,
    total_leads: leads,
    total_add_to_cart: atc,
    total_landing_views: row.total_landing_views || 0,
    total_wa_msgs: wa,
    total_engagement: row.total_engagement || 0,
    total_video_views: row.total_video_views || 0,
    avg_cpm: Math.round((row.avg_cpm || 0) * 100) / 100,
    avg_frequency: Math.round((row.avg_frequency || 0) * 100) / 100,
    roas, ctr, cpc, cpl, cpa,
    cost_per_result: cpr,
    primary_result_type: wa > 0 ? "whatsapp_msgs" : leads > 0 ? "leads" : purchases > 0 ? "purchases" : "link_clicks",
  };
}

export async function getMetaSummaryV2(startDate, endDate) {
  const match = {};
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const rows = await MetaInsight.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$campaignName",
        spend: { $sum: "$spend" },
        link_clicks: { $sum: "$linkClicks" },
        impressions: { $sum: "$impressions" },
        reach: { $sum: "$reach" },
        frequency: { $avg: "$frequency" },
        cpm: { $avg: "$cpm" },
        landing_views: { $sum: "$landingViews" },
        whatsapp_msgs: { $sum: "$whatsappMsgs" },
        purchases: { $sum: "$purchases" },
        leads: { $sum: "$leads" },
        add_to_cart: { $sum: "$addToCart" },
        post_engagement: { $sum: "$postEngagement" },
        video_views: { $sum: "$videoViews" },
        revenue: { $sum: "$revenue" }
      }
    },
    { $sort: { spend: -1 } }
  ]);

  return rows.map(row => {
    const spend = row.spend || 0;
    const lc = row.link_clicks || 0;
    const imps = row.impressions || 0;
    const rev = row.revenue || 0;
    const purch = row.purchases || 0;
    const leads = row.leads || 0;
    const wa = row.whatsapp_msgs || 0;
    const primary = wa || leads || purch;
    return {
      ...row,
      campaign_name: row._id,
      spend,
      revenue: rev,
      roas: spend > 0 && rev > 0 ? Math.round((rev / spend) * 100) / 100 : 0,
      ctr: imps > 0 ? Math.round((lc / imps * 100) * 100) / 100 : 0,
      cpc: lc > 0 ? Math.round((spend / lc) * 100) / 100 : 0,
      cpl: leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0,
      cpa: purch > 0 ? Math.round((spend / purch) * 100) / 100 : 0,
      cpr: primary > 0 ? Math.round((spend / primary) * 100) / 100 : 0,
    };
  });
}

// Add these to avoid 404s
export const getProductPerformance = async () => [];
export const getCreativePerformance = async () => [];
export const getBudgetVsActual = async () => [];
export const getAgencyTransparency = async () => [];
export const getAiInsights = async () => [];
export const getRevenueBySource = async () => [];
export const getAssistedConversions = async () => [];

// ── Data Coverage ─────────────────────────────────────────────────────────────

export async function getDataCoverage(startDate, endDate) {
  // Optional date filtering. When no range is given the totals reflect the
  // entire database; when a range is given they reflect just that window.
  const match = {};
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const pipeline = [];
  if (Object.keys(match).length) pipeline.push({ $match: match });
  pipeline.push({
    $group: {
      _id: null,
      min_date: { $min: "$date" },
      max_date: { $max: "$date" },
      total_records: { $sum: 1 },
      total_campaigns: { $addToSet: "$campaignName" },
      total_spend: { $sum: "$spend" },
      total_impressions: { $sum: "$impressions" },
      total_clicks: { $sum: "$linkClicks" },
      total_purchases: { $sum: "$purchases" },
      total_leads: { $sum: "$leads" },
      total_wa_msgs: { $sum: "$whatsappMsgs" },
    }
  });

  const [row] = await MetaInsight.aggregate(pipeline);

  if (!row) return { has_data: false, total_records: 0 };

  return {
    has_data: true,
    min_date: row.min_date,
    max_date: row.max_date,
    total_records: row.total_records,
    total_campaigns: row.total_campaigns.length,
    total_spend: row.total_spend,
    total_impressions: row.total_impressions,
    total_clicks: row.total_clicks,
    total_purchases: row.total_purchases,
    total_leads: row.total_leads,
    total_wa_msgs: row.total_wa_msgs,
  };
}

export async function syncManualData(startDate, endDate) {
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const [metaResult] = await Promise.all([
    syncMetaAdsSpend(start, end),
  ]);

  return {
    status: "success",
    meta: metaResult,
    google: { status: "skipped", reason: "Google Ads credentials not configured" },
  };
}


