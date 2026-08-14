import axios from "axios";
import AppError from "../../shared/utils/appError.js";
import logger from "../../shared/infrastructure/logger.js";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || "EVRLVE";

/**
 * Send an OTP via MSG91 OTP API.
 * @param {string} to   - E.164-formatted phone number (e.g. "+919876543210")
 * @param {string} otp  - Raw numeric OTP string (4-6 digits)
 */
export const sendOtpSms = async (to, otp) => {
  // Validate env vars
  if (!MSG91_AUTH_KEY || !MSG91_TEMPLATE_ID) {
    throw new AppError(
      "SMS service is not configured. Set MSG91_AUTH_KEY and MSG91_TEMPLATE_ID.",
      503
    );
  }

  // Strip '+' from E.164 format for MSG91 (expects: 919876543210, not +919876543210)
  const mobile = to.replace(/^\+/, "");

  const url = "https://control.msg91.com/api/v5/otp";
  const payload = {
    template_id: MSG91_TEMPLATE_ID,
    mobile,
    authkey: MSG91_AUTH_KEY,
    otp,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000, // 10s timeout
    });

    const { data } = response;

    // MSG91 returns { type: 'success', ... } or { type: 'error', message: '...' }
    if (data.type === "error") {
      const message = data.message || "Unknown MSG91 error";
      logger.error(`MSG91 OTP send failed for ${mobile.slice(0, 4)}XXXXXX: ${message}`);
      throw new AppError(message, 400);
    }

    logger.info(`OTP sent via MSG91 to ${mobile.slice(0, 4)}XXXXXX`);
  } catch (err) {
    // Handle network/timeout errors vs MSG91 API errors
    if (err instanceof AppError) {
      throw err;
    }

    if (err.code === "ECONNABORTED" || err.code === "ENOTFOUND") {
      logger.error(`MSG91 connection failed for ${mobile.slice(0, 4)}XXXXXX: ${err.message}`);
      throw new AppError("SMS service unavailable. Please try again.", 502);
    }

    logger.error(`MSG91 OTP send failed for ${mobile.slice(0, 4)}XXXXXX: ${err.message}`);
    throw new AppError("SMS delivery failed. Please try again.", 502);
  }
};

/**
 * Resend OTP via MSG91 retry endpoint.
 * @param {string} to   - E.164-formatted phone number
 * @param {'text'|'voice'} retryType - delivery channel for retry (default: 'text')
 */
export const resendOtp = async (to, retryType = "text") => {
  if (!MSG91_AUTH_KEY) {
    throw new AppError("SMS service is not configured. Set MSG91_AUTH_KEY.", 503);
  }

  const mobile = to.replace(/^\+/, "");
  const url = `https://control.msg91.com/api/v5/otp/retry?authkey=${MSG91_AUTH_KEY}&mobile=${mobile}&retrytype=${retryType}`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const { data } = response;

    if (data.type === "error") {
      const message = data.message || "Unknown MSG91 error";
      logger.error(`MSG91 OTP resend failed for ${mobile.slice(0, 4)}XXXXXX: ${message}`);
      throw new AppError(message, 400);
    }

    logger.info(`OTP resent via MSG91 (${retryType}) to ${mobile.slice(0, 4)}XXXXXX`);
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    logger.error(`MSG91 OTP resend failed: ${err.message}`);
    throw new AppError("SMS resend failed. Please try again.", 502);
  }
};

/**
 * Send a transactional SMS via MSG91 Flow API.
 * @param {string} to        - E.164 phone number (e.g. "+919876543210")
 * @param {string} flowId    - MSG91 Flow ID (from console)
 * @param {object} variables - Template variables, e.g. { order_id: "ORD-001", amount: "499" }
 */
export const sendTransactionalSms = async (to, flowId, variables = {}) => {
  if (!MSG91_AUTH_KEY || !flowId) {
    throw new AppError('MSG91 transactional SMS not configured.', 503);
  }

  const mobile = to.replace(/^\+/, '');

  const payload = {
    flow_id: flowId,
    sender: MSG91_SENDER_ID,
    mobiles: mobile,
    ...variables,
  };

  try {
    const response = await axios.post(
      'https://control.msg91.com/api/v5/flow/',
      payload,
      {
        headers: {
          authkey: MSG91_AUTH_KEY,
          'Content-Type': 'application/JSON',
        },
        timeout: 10000,
      }
    );

    const { data } = response;
    if (data.type === 'error') {
      logger.error(`MSG91 flow SMS failed for ${mobile.slice(0, 4)}XXXXXX: ${data.message}`);
      throw new AppError(data.message || 'MSG91 flow error', 400);
    }

    logger.info(`Transactional SMS sent via MSG91 flow ${flowId} to ${mobile.slice(0, 4)}XXXXXX`);
  } catch (err) {
    if (err instanceof AppError) throw err;
    logger.error(`MSG91 flow SMS error: ${err.message}`);
    throw new AppError('Transactional SMS delivery failed.', 502);
  }
};
