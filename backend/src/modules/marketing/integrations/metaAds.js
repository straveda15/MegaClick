import fetch from "node-fetch";
import { AdSpend, MetaInsight } from "../marketing.model.js";

const META_API = "https://graph.facebook.com/v18.0";

function getAction(actions, ...types) {
  let total = 0;
  for (const a of actions || []) {
    if (types.includes(a.action_type)) {
      total += parseInt(parseFloat(a.value || 0));
    }
  }
  return total;
}

function getActionValue(actionValues, ...types) {
  let total = 0.0;
  for (const a of actionValues || []) {
    if (types.includes(a.action_type)) {
      total += parseFloat(a.value || 0);
    }
  }
  return total;
}

/**
 * @param {Date} startDate
 * @param {Date} endDate
 */
export async function syncMetaAdsSpend(startDate, endDate) {
  const token = process.env.META_ACCESS_TOKEN?.trim();
  const accountIdRaw = process.env.META_AD_ACCOUNT_ID?.trim();

  if (!token || !accountIdRaw) {
    return { status: "skipped", reason: "Meta Ads credentials missing in .env" };
  }

  const accountId = accountIdRaw.startsWith("act_") ? accountIdRaw : `act_${accountIdRaw}`;
  const fmt = (d) => d.toISOString().slice(0, 10);

  try {
    const fields = [
      "campaign_id", "campaign_name", "spend", "clicks", "impressions",
      "reach", "frequency", "cpm", "actions", "action_values",
      "cost_per_action_type", "purchase_roas", "date_start", "date_stop",
    ].join(",");

    const params = new URLSearchParams({
      access_token: token,
      fields,
      time_range: JSON.stringify({ since: fmt(startDate), until: fmt(endDate) }),
      time_increment: "1",
      level: "campaign",
      limit: "500",
    });

    const resp = await fetch(`${META_API}/${accountId}/insights?${params}`);
    const body = await resp.json();

    if (!resp.ok) {
      throw new Error(body?.error?.message || resp.statusText);
    }

    const records = body.data || [];
    console.log(`[MetaAds] API returned ${records.length} results.`);

    if (!records.length) {
      return { status: "success", records_synced: 0, message: "No data found for this range" };
    }

    let synced = 0;
    for (const r of records) {
      const actions = r.actions || [];
      const actionValues = r.action_values || [];
      const purchaseRoas = r.purchase_roas || [];

      const spend = parseFloat(r.spend || 0);
      const impressions = parseInt(r.impressions || 0);
      const date = new Date(r.date_start);
      date.setHours(0, 0, 0, 0);

      // Correct action parsing
      const linkClicks = getAction(actions, "link_click", "outbound_click");
      const purchases = getAction(actions, "purchase", "omni_purchase");
      const leads = getAction(actions, "lead", "onsite_web_lead");
      const waMsgs = getAction(actions, "whatsapp_message_send", "onsite_conversion.messaging_conversation_started_7d");
      const addToCart = getAction(actions, "add_to_cart", "omni_add_to_cart");
      const landingViews = getAction(actions, "landing_page_view");
      const postEngage = getAction(actions, "post_engagement");
      const videoViews = getAction(actions, "video_view");

      // Revenue from action_values
      const revenue = getActionValue(actionValues, "purchase", "omni_purchase") ||
        (purchaseRoas.length > 0 ? parseFloat(purchaseRoas[0]?.value || 0) * spend : 0);

      const roas = spend > 0 && revenue > 0 ? parseFloat((revenue / spend).toFixed(4)) : 0;
      const primary = waMsgs || leads || purchases || linkClicks;
      const cpr = primary > 0 ? parseFloat((spend / primary).toFixed(4)) : 0;
      const ctr = impressions > 0 ? parseFloat((linkClicks / impressions * 100).toFixed(4)) : 0;
      const cpc = linkClicks > 0 ? parseFloat((spend / linkClicks).toFixed(4)) : 0;

      // 1. Sync to AdSpend (general collection)
      await AdSpend.updateOne(
        { platform: "meta", campaignId: r.campaign_id, date },
        {
          $set: {
            spend,
            clicks: linkClicks,
            impressions,
            campaignName: r.campaign_name,
            currency: "INR",
          },
        },
        { upsert: true }
      );

      // 2. Sync to MetaInsight (detailed collection)
      await MetaInsight.updateOne(
        { campaignId: r.campaign_id, date },
        {
          $set: {
            campaignName: r.campaign_name,
            spend,
            clicks: linkClicks,
            impressions,
            reach: parseInt(r.reach || 0),
            frequency: parseFloat(r.frequency || 0),
            cpm: parseFloat(r.cpm || 0),
            cpc,
            ctr,
            linkClicks,
            landingViews,
            whatsappMsgs: waMsgs,
            purchases,
            leads,
            addToCart,
            postEngagement: postEngage,
            videoViews,
            revenue,
            roas,
            costPerResult: cpr,
            primaryResult: primary,
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
    console.error("Meta Ads sync error:", error);
    return { status: "error", reason: error.message };
  }
}
