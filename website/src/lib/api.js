/**
 * Base URL of the MegaClick backend.
 *
 * Left blank in production builds served from the same origin as the API; set
 * VITE_API_URL in .env for local development, where Vite (5173) and the backend
 * (5000) are on different ports.
 */
export const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Submits the website contact form. Creates an unassigned lead on the
 * dashboard's Leads board carrying the visitor's details and the service they
 * picked.
 */
export async function submitContactForm(payload) {
  let res;

  try {
    res = await fetch(`${API_BASE}/api/v1/sales/contact-us`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // fetch itself rejected — the visitor is offline or the API is unreachable.
    throw new Error("Could not reach our servers. Please check your connection and try again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}
