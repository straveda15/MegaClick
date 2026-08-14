/**
 * Shipment Error Classes — structured error abstraction.
 *
 * Every error carries a machine-readable `code` so controllers can map
 * to the correct HTTP status without inspecting error messages.
 */

/* ── Base ────────────────────────────────────────────────────────────────── */

export class ShipmentError extends Error {
  /**
   * @param {string} message  - Human-readable description.
   * @param {string} code     - Machine-readable error code (e.g. "PROVIDER_API_ERROR").
   * @param {number} httpStatus - Suggested HTTP status code.
   * @param {Object} [meta]   - Extra context (provider name, raw response, etc.).
   */
  constructor(message, code, httpStatus = 500, meta = {}) {
    super(message);
    this.name = "ShipmentError";
    this.code = code;
    this.httpStatus = httpStatus;
    this.meta = meta;
    Error.captureStackTrace?.(this, this.constructor);
  }

  /** Serialise for JSON responses. */
  toJSON() {
    return {
      error: this.code,
      message: this.message,
      ...(Object.keys(this.meta).length > 0 && { details: this.meta }),
    };
  }
}

/* ── Provider API Error — remote call failed ─────────────────────────────── */

export class ShipmentProviderError extends ShipmentError {
  constructor(message, { httpStatus = 502, ...meta } = {}) {
    super(message, "PROVIDER_API_ERROR", httpStatus, meta);
    this.name = "ShipmentProviderError";
  }
}

/* ── Config Error — missing / invalid provider config ────────────────────── */

export class ShipmentConfigError extends ShipmentError {
  constructor(message, meta = {}) {
    super(message, "PROVIDER_CONFIG_ERROR", 503, meta);
    this.name = "ShipmentConfigError";
  }
}

/* ── Validation Error — DTO / payload validation failure ─────────────────── */

export class ShipmentValidationError extends ShipmentError {
  constructor(message, meta = {}) {
    super(message, "VALIDATION_ERROR", 400, meta);
    this.name = "ShipmentValidationError";
  }
}

/* ── Serviceability Error — pincode / route not served ───────────────────── */

export class ShipmentServiceabilityError extends ShipmentError {
  constructor(message, meta = {}) {
    super(message, "SERVICEABILITY_ERROR", 422, meta);
    this.name = "ShipmentServiceabilityError";
  }
}

/* ── Not Found — shipment / tracking ID doesn't exist ────────────────────── */

export class ShipmentNotFoundError extends ShipmentError {
  constructor(message = "Shipment not found", meta = {}) {
    super(message, "SHIPMENT_NOT_FOUND", 404, meta);
    this.name = "ShipmentNotFoundError";
  }
}

/* ── Duplicate — shipment already exists for this order ──────────────────── */

export class ShipmentDuplicateError extends ShipmentError {
  constructor(message = "Shipment already exists for this order", meta = {}) {
    super(message, "DUPLICATE_SHIPMENT", 409, meta);
    this.name = "ShipmentDuplicateError";
  }
}

/* ── Webhook Auth Error — signature validation failed ────────────────────── */

export class WebhookAuthError extends ShipmentError {
  constructor(message = "Invalid webhook signature", meta = {}) {
    super(message, "WEBHOOK_AUTH_ERROR", 401, meta);
    this.name = "WebhookAuthError";
  }
}
