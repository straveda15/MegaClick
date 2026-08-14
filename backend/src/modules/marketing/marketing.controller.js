import * as analytics from "./marketing.service.js";
import { parse } from "csv-parse/sync";
import { v4 as uuidv4 } from "uuid";
import { AdSpend, MarketingSession, MarketingEvent, MarketingOrder, MetaInsight } from "./marketing.model.js";
import { lookupLocationString } from "../../shared/infrastructure/geoip.js";

const parseDate = (v) => (v ? new Date(v) : undefined);

// ── Dashboard endpoints ────────────────────────────────────────────────────────

export const getDashboardKpis = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    res.json(await analytics.getDashboardKpis(parseDate(start_date), parseDate(end_date)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpendRevenueTimeseries = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    res.json(await analytics.getSpendRevenueTimeseriesFixed(parseDate(start_date), parseDate(end_date)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMetaTimeseries = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    res.json(await analytics.getMetaTimeseries(parseDate(start_date), parseDate(end_date)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDataCoverage = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    res.json(await analytics.getDataCoverage(start_date, end_date));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCampaignPerformance = async (req, res) => {
  try {
    res.json(await analytics.getCampaignPerformance());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversionFunnel = async (req, res) => {
  try {
    res.json(await analytics.getConversionFunnel());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductPerformance = async (req, res) => {
  try { res.json(await analytics.getProductPerformance()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getCreativePerformance = async (req, res) => {
  try { res.json(await analytics.getCreativePerformance()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getBudgetVsActual = async (req, res) => {
  try { res.json(await analytics.getBudgetVsActual()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getAgencyTransparency = async (req, res) => {
  try { res.json(await analytics.getAgencyTransparency()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getAiInsights = async (req, res) => {
  try { res.json(await analytics.getAiInsights()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

// ── Attribution ───────────────────────────────────────────────────────────────

export const getRevenueBySource = async (req, res) => {
  try { res.json(await analytics.getRevenueBySource()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getAssistedConversions = async (req, res) => {
  try { res.json(await analytics.getAssistedConversions()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

// ── Dataset ───────────────────────────────────────────────────────────────────

export const getDeviceBreakdown = async (req, res) => {
  try { res.json(await analytics.getDeviceBreakdown()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getKeywordPerformance = async (req, res) => {
  try { res.json(await analytics.getKeywordPerformance()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getFullCampaignMetrics = async (req, res) => {
  try { res.json(await analytics.getFullCampaignMetrics()); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

// ── Meta ──────────────────────────────────────────────────────────────────────

export const getMetaSummaryV2 = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    res.json(await analytics.getMetaSummaryV2(parseDate(start_date), parseDate(end_date)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMetaKpisV2 = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    res.json(await analytics.getMetaKpisV2(parseDate(start_date), parseDate(end_date)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const syncPlatformData = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    const result = await analytics.syncManualData(start_date, end_date);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ── CSV Import ──────────────────────────────────────────────────────────────

function cleanMoney(v) {
  if (!v || !String(v).trim()) return null;
  try { return parseFloat(String(v).replace(/[$,\s]/g, "").trim()); }
  catch { return null; }
}

function cleanFloat(v) {
  if (!v || !String(v).trim()) return null;
  try { return parseFloat(String(v).replace(/[$,\s%]/g, "").trim()); }
  catch { return null; }
}

function cleanInt(v) {
  const f = cleanFloat(v);
  return f !== null ? Math.trunc(f) : 0;
}

function cleanDate(v) {
  if (!v) return null;
  const s = String(v).trim();
  const d = new Date(s);
  if (!isNaN(d)) return d;
  return null;
}

function normCampaign(name) {
  if (!name) return "Unknown Campaign";
  const key = name.trim().toLowerCase().replace(/\s+/g, "");
  const variants = {
    dataanalyticscourse: "Data Analytics Course",
    dataanalyticscorse: "Data Analytics Course",
    dataanlyticscorse: "Data Analytics Course",
    dataanalytciscourse: "Data Analytics Course",
  };
  return variants[key] || name.trim();
}

function normDevice(v) {
  const s = v ? String(v).trim().toLowerCase() : "";
  return ["mobile", "desktop", "tablet"].includes(s) ? s : "unknown";
}

function normLocation(v) {
  if (!v) return "Unknown";
  const m = { hyderabad: "Hyderabad", hyderbad: "Hyderabad", hydrebad: "Hyderabad" };
  const s = String(v).trim();
  return m[s.toLowerCase()] || s.charAt(0).toUpperCase() + s.slice(1);
}

export const importKaggleCsv = async (req, res) => {
  if (!req.file) return res.status(400).json({ detail: "No file uploaded" });

  try {
    const rows = parse(req.file.buffer.toString("utf-8").replace(/^\uFEFF/, ""), {
      columns: true, skip_empty_lines: true, trim: true,
    });

    const deviceUsers = {
      desktop: "b0000000-0000-0000-0000-000000000001",
      mobile: "b0000000-0000-0000-0000-000000000002",
      tablet: "b0000000-0000-0000-0000-000000000003",
      unknown: "b0000000-0000-0000-0000-000000000004",
    };

    const stats = { total: 0, spend: 0, sessions: 0, orders: 0, events: 0, skipped: 0 };

    for (const row of rows) {
      stats.total++;

      const adId = (row["Ad_ID"] || "").trim();
      const campaign = normCampaign(row["Campaign_Name"] || "");
      const clicks = cleanInt(row["Clicks"]);
      const impressions = cleanInt(row["Impressions"]);
      const cost = cleanMoney(row["Cost"]);
      const leads = cleanInt(row["Leads"]);
      const conversions = cleanInt(row["Conversions"]);
      const convRate = cleanFloat(row["Conversion Rate"]) || 0;
      const saleAmount = cleanMoney(row["Sale_Amount"]);
      const adDate = cleanDate(row["Ad_Date"]);
      const location = normLocation(row["Location"] || "");
      const device = normDevice(row["Device"] || "");
      const keyword = (row["Keyword"] || "").trim().toLowerCase();

      if (!adDate || !adId) { stats.skipped++; continue; }

      const userId = deviceUsers[device] || deviceUsers.unknown;
      const sessionId = `kg_${adId}`;
      const ctrVal = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0;

      // 1. ad_spend
      if (cost !== null && cost > 0) {
        await AdSpend.updateOne(
          { platform: "google", campaignId: adId, date: adDate },
          { $set: { spend: cost, clicks, impressions, campaignName: campaign } },
          { upsert: true }
        );
        stats.spend++;
      }

      // 2. session
      await MarketingSession.updateOne(
        { sessionId },
        {
          $set: {
            userId, utmSource: "google", utmCampaign: campaign, utmMedium: "cpc",
            utmTerm: keyword, platform: "google", channel: "consideration",
            device, location, createdAt: adDate
          }
        },
        { upsert: true }
      );
      stats.sessions++;

      // 3. events
      await MarketingEvent.create({
        sessionId, eventType: "page_view", createdAt: adDate,
        eventData: { keyword, location, device, clicks, impressions, ctr: ctrVal, conv_rate: convRate }
      });
      stats.events++;

      if (leads > 0) {
        await MarketingEvent.create({
          sessionId, eventType: "add_to_cart", createdAt: adDate,
          eventData: { leads, keyword, campaign }
        });
        stats.events++;
      }

      if (conversions > 0 && saleAmount && saleAmount > 0) {
        await MarketingOrder.updateOne(
          { externalOrderId: `kg_order_${adId}` },
          { $set: { sessionId, revenue: saleAmount, status: "completed", createdAt: adDate } },
          { upsert: true }
        );
        stats.orders++;

        await MarketingEvent.create({
          sessionId, eventType: "purchase", createdAt: adDate,
          eventData: {
            product_name: campaign, keyword, revenue: saleAmount,
            conversions, creative_name: keyword, creative_type: "Search Ad",
            ctr: ctrVal, conv_rate: convRate,
          }
        });
        stats.events++;
      }
    }

    res.json({ status: "success", imported: stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const importMetaCsv = async (req, res) => {
  if (!req.file) return res.status(400).json({ detail: "No file uploaded" });

  try {
    const rows = parse(req.file.buffer.toString("utf-8").replace(/^\uFEFF/, ""), {
      columns: true, skip_empty_lines: true, trim: true,
    });

    const c = (v) => {
      if (!v || !String(v).trim()) return 0.0;
      try { return parseFloat(String(v).replace(/,/g, "").trim()); }
      catch { return 0.0; }
    };

    const stats = { total: 0, inserted: 0, skipped: 0 };

    for (const row of rows) {
      stats.total++;
      const campaign = (row["Campaign name"] || "").trim();
      if (!campaign) { stats.skipped++; continue; }

      const spend = c(row["Amount spent (INR)"]);
      const reach = Math.trunc(c(row["Reach"]));
      const imps = Math.trunc(c(row["Impressions"]));
      const lc = Math.trunc(c(row["Link clicks"]));
      const freq = c(row["Frequency"]);
      const cpm = c(row["CPM (cost per 1,000 impressions) (INR)"]);
      const cpc = c(row["CPC (cost per link click) (INR)"]);
      const ctr = c(row["CTR (link click-through rate)"]) * 100;
      const lv = Math.trunc(c(row["Landing page views"]));
      const wa = Math.trunc(c(row["Messaging conversations started"]));
      const purch = Math.trunc(c(row["Purchases"]));
      const revenue = c(row["Purchases conversion value"]);
      const atc = Math.trunc(c(row["Adds to cart"]));
      const roasVal = c(row["Purchase ROAS (return on ad spend)"]);

      const roas = roasVal > 0 ? roasVal : (spend > 0 && revenue > 0 ? Math.round((revenue / spend) * 10000) / 10000 : 0);
      const primary = wa || purch || lc;
      const cpr = primary > 0 ? Math.round((spend / primary) * 100) / 100 : 0;

      const cid = `csv_${campaign.slice(0, 40).replace(/\s+/g, "_").replace(/[–—]/g, "-")}`;

      // Use the actual ad date from the CSV ("Day" column, format YYYY-MM-DD).
      // Meta Ads Manager exports include this column. Fall back to today only if absent.
      const rawDay = (row["Day"] || row["Reporting starts"] || row["Date"] || "").trim();
      const parsedDay = rawDay ? new Date(rawDay) : null;
      const tdate = parsedDay && !isNaN(parsedDay.getTime()) ? parsedDay : new Date();
      tdate.setHours(0, 0, 0, 0);

      await MetaInsight.updateOne(
        { campaignId: cid, date: tdate },
        {
          $set: {
            campaignName: campaign, spend, clicks: lc, impressions: imps, reach,
            frequency: freq, cpm, cpc, ctr, linkClicks: lc, landingViews: lv,
            whatsappMsgs: wa, purchases: purch, addToCart: atc,
            revenue, roas, costPerResult: cpr, primaryResult: primary
          }
        },
        { upsert: true }
      );
      stats.inserted++;
    }

    res.json({ status: "success", imported: stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const trackEvent = async (req, res) => {
  try {
    const { sessionId, visitorId, userId, eventType, eventData, utmSource, utmCampaign, utmMedium, landingPage } = req.body;

    if (!sessionId || !eventType) {
      return res.status(400).json({ error: "sessionId and eventType are required" });
    }

    // Landing page = the page the visitor first entered the store on. Derive it from
    // whatever the first event of this session carries (explicit landingPage, else the
    // page_view's path), and persist it once via $setOnInsert so it sticks to the visit.
    const rawLanding =
      landingPage || eventData?.page || eventData?.path || eventData?.url || null;
    const entryPath = (() => {
      if (!rawLanding) return null;
      let p = String(rawLanding).trim();
      try { if (/^https?:\/\//i.test(p)) p = new URL(p).pathname; } catch { /* keep raw */ }
      p = p.split("?")[0].split("#")[0];
      if (!p.startsWith("/")) p = "/" + p;
      if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
      return p || "/";
    })();

    // Resolve the visitor's geo from their IP (trust-proxy makes req.ip the real
    // client behind a load balancer). Returns null in dev/private IPs or when the
    // GeoLite2 DB is absent — we simply omit location and the analytics layer keeps
    // its existing "Unknown" handling. Set on insert so it sticks to the visit.
    const clientIp =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress;
    const location = await lookupLocationString(clientIp);

    // 1. Ensure the session exists (upsert). A rotating sessionId means each
    //    visit creates its own MarketingSession; visitorId stays stable across
    //    visits so distinct-visitor counts dedupe returning browsers.
    await MarketingSession.updateOne(
      { sessionId },
      {
        $set: {
          ...(visitorId && { visitorId }),
          ...(userId && { userId }),
          ...(utmSource && { utmSource }),
          ...(utmCampaign && { utmCampaign }),
          ...(utmMedium && { utmMedium }),
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date(),
          device: req.headers["user-agent"]?.includes("Mobi") ? "mobile" : "desktop",
          ...(location && { location }),
          ...(entryPath && { landingPage: entryPath })
        }
      },
      { upsert: true }
    );

    // 2. Create the event
    const event = await MarketingEvent.create({
      sessionId,
      eventType,
      eventData,
      createdAt: new Date()
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
