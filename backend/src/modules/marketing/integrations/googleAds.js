import { GoogleAdsApi } from "google-ads-api";
import { AdSpend } from "../marketing.model.js";

/**
 * @param {Date} startDate
 * @param {Date} endDate
 */
export async function syncGoogleAdsSpend(startDate, endDate) {
  const developer_token = process.env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim();
  const client_id = process.env.GOOGLE_ADS_CLIENT_ID?.trim();
  const client_secret = process.env.GOOGLE_ADS_CLIENT_SECRET?.trim();
  const refresh_token = process.env.GOOGLE_ADS_REFRESH_TOKEN?.trim();
  const customer_id = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.trim()?.replace(/-/g, "");

  if (!developer_token || !refresh_token) {
    return { status: "skipped", reason: "Google Ads credentials missing in .env" };
  }

  try {
    const client = new GoogleAdsApi({
      client_id,
      client_secret,
      developer_token,
    });

    const customer = client.Customer({
      customer_id,
      refresh_token,
    });

    const fmt = (d) => d.toISOString().slice(0, 10);

    const { results } = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        metrics.cost_micros,
        metrics.clicks,
        metrics.impressions,
        segments.date
      FROM campaign
      WHERE segments.date BETWEEN '${fmt(startDate)}' AND '${fmt(endDate)}'
        AND campaign.status != 'REMOVED'
      ORDER BY segments.date DESC
    `);

    console.log(`[GoogleAds] API returned ${results?.length || 0} results.`);

    if (!results || results.length === 0) {

      return { status: "success", records_synced: 0, message: "No campaign data found" };
    }

    let synced = 0;
    for (const row of results) {
      const spend = parseFloat((row.metrics.cost_micros / 1000000).toFixed(6));
      const date = new Date(row.segments.date);
      date.setHours(0, 0, 0, 0);

      await AdSpend.updateOne(
        { platform: "google", campaignId: String(row.campaign.id), date },
        {
          $set: {
            spend,
            clicks: parseInt(row.metrics.clicks || 0),
            impressions: parseInt(row.metrics.impressions || 0),
            campaignName: row.campaign.name,
            currency: "INR", // Based on UI preference
          },
        },
        { upsert: true }
      );
      synced++;
    }

    return {
      status: "success",
      records_synced: synced,
      date_range: `${fmt(startDate)} to ${fmt(endDate)}`,
    };
  } catch (error) {
    console.error("Google Ads sync error:", error);
    return { status: "error", reason: error.message };
  }
}
