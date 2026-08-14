/**
 * ShipmentProvider Interface — Strategy Pattern contract.
 *
 * Every shipping provider adapter MUST extend this class and implement
 * all nine methods. The ProviderFactory returns instances of these
 * adapters; the service layer calls them polymorphically.
 *
 * Methods receive normalised DTO payloads and MUST return
 * normalised DTO responses (see dto/shipment.dto.js).
 */

export class ShipmentProviderInterface {
  /**
   * @param {string} providerName - Machine name of this provider.
   * @param {Object} config       - Provider-specific config from DB.
   */
  constructor(providerName, config = {}) {
    if (new.target === ShipmentProviderInterface) {
      throw new Error(
        "ShipmentProviderInterface is abstract — cannot instantiate directly."
      );
    }
    this.providerName = providerName;
    this.config = config;
  }

  /**
   * Push a new order to the provider.
   * @param {Object} payload - CreateOrderRequest DTO.
   * @param {Object} [options]
   * @param {string|null} [options.idempotencyKey]
   * @returns {Promise<Object>} - CreateOrderResponse DTO.
   */
  async createOrder(payload, _options = {}) {
    throw new Error(`${this.providerName}: createOrder() not implemented`);
  }

  /**
   * Assign a courier (manual or auto) to a shipment.
   * @param {Object} payload - AssignCourierRequest DTO.
   * @param {Object} [options]
   * @param {string|null} [options.idempotencyKey]
   * @returns {Promise<Object>} - AssignCourierResponse DTO.
   */
  async assignCourier(payload, _options = {}) {
    throw new Error(`${this.providerName}: assignCourier() not implemented`);
  }

  /**
   * Schedule a pickup from the warehouse.
   * @param {Object} payload - SchedulePickupRequest DTO.
   * @param {Object} [options]
   * @param {string|null} [options.idempotencyKey]
   * @returns {Promise<Object>} - SchedulePickupResponse DTO.
   */
  async schedulePickup(payload, _options = {}) {
    throw new Error(`${this.providerName}: schedulePickup() not implemented`);
  }

  /**
   * Cancel a previously created order/shipment.
   * @param {Object} payload - CancelOrderRequest DTO.
   * @returns {Promise<Object>} - CancelOrderResponse DTO.
   */
  async cancelOrder(payload) {
    throw new Error(`${this.providerName}: cancelOrder() not implemented`);
  }

  /**
   * Get current tracking information.
   * @param {Object} payload - TrackOrderRequest DTO.
   * @returns {Promise<Object>} - TrackOrderResponse DTO.
   */
  async trackOrder(payload) {
    throw new Error(`${this.providerName}: trackOrder() not implemented`);
  }

  /**
   * Generate / fetch the shipping label.
   * @param {Object} payload - GenerateLabelRequest DTO.
   * @returns {Promise<Object>} - GenerateLabelResponse DTO.
   */
  async generateLabel(payload) {
    throw new Error(`${this.providerName}: generateLabel() not implemented`);
  }

  /**
   * Calculate shipping rates for a given route/weight.
   * @param {Object} payload - CalculateRatesRequest DTO.
   * @returns {Promise<Object>} - CalculateRatesResponse DTO.
   */
  async calculateRates(payload) {
    throw new Error(`${this.providerName}: calculateRates() not implemented`);
  }

  /**
   * Check if a route (origin → destination) is serviceable.
   * @param {Object} payload - ServiceabilityRequest DTO.
   * @returns {Promise<Object>} - ServiceabilityResponse DTO.
   */
  async checkServiceability(payload) {
    throw new Error(
      `${this.providerName}: checkServiceability() not implemented`
    );
  }

  /**
   * Create a return shipment (Reverse Logistics).
   * @param {Object} payload - CreateReturnRequest DTO.
   * @param {Object} [options]
   * @param {string|null} [options.idempotencyKey]
   * @returns {Promise<Object>} - CreateReturnResponse DTO.
   */
  async createReturn(payload, _options = {}) {
    throw new Error(`${this.providerName}: createReturn() not implemented`);
  }
}
