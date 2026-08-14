/**
 * Provider Registry — maps provider name strings to adapter classes.
 *
 * Adding a new provider? Two steps:
 *   1. Create a new adapter file in providers/ that extends ShipmentProviderInterface
 *   2. Register it here with one line
 *
 * The ProviderFactory uses this registry to instantiate the correct adapter.
 */

import { ShipmozoAdapter } from "./shipmozo.adapter.js";
import { IndiaPostAdapter } from "./indiapost.adapter.js";
import { MockAdapter } from "./mock.adapter.js";
import { ShiprocketAdapter } from "./shiprocket.adapter.js";

/**
 * Map of provider name (lowercase) → Adapter class constructor.
 *
 * To add a new provider:
 *   import { DelhiveryAdapter } from "./delhivery.adapter.js";
 *   PROVIDER_REGISTRY.set("delhivery", DelhiveryAdapter);
 */
const PROVIDER_REGISTRY = new Map([
  ["shiprocket", ShiprocketAdapter],
  ["shipmozo", ShipmozoAdapter],
  ["indiapost", IndiaPostAdapter],
  ["mock", MockAdapter],
]);

/**
 * Get the adapter class for a given provider name.
 * @param {string} name — provider name (case-insensitive).
 * @returns {Function|null} — adapter class constructor, or null if not found.
 */
export function getAdapterClass(name) {
  return PROVIDER_REGISTRY.get(name?.toLowerCase?.()) || null;
}

/**
 * Check if a provider name is registered.
 * @param {string} name
 * @returns {boolean}
 */
export function isProviderRegistered(name) {
  return PROVIDER_REGISTRY.has(name?.toLowerCase?.());
}

/**
 * Get all registered provider names.
 * @returns {string[]}
 */
export function getRegisteredProviders() {
  return Array.from(PROVIDER_REGISTRY.keys());
}

export default PROVIDER_REGISTRY;
