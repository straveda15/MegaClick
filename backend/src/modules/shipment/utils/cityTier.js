/**
 * CityTier — maps Indian pincodes to logistics tiers.
 *
 * Tier 1: Major metros (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad)
 * Tier 2: State capitals + cities with population > 500k
 * Tier 3: Everything else (semi-urban, rural)
 *
 * Used by the factory to prefer faster providers (Shiprocket) for Tier 1/2
 * and India Post for Tier 3 where it has better last-mile coverage.
 */

// prefix → tier: keyed by 3-digit pincode prefix (string)
const TIER_MAP = new Map([
  // ── Tier 1 — Major Metros ────────────────────────────────────────────────
  // Delhi NCR
  ["110", 1], ["111", 1], ["112", 1], ["113", 1], ["114", 1], ["115", 1],
  ["116", 1], ["117", 1], ["118", 1], ["119", 1], ["120", 1], ["121", 1],
  ["122", 1], ["123", 1], ["124", 1], ["125", 1],
  // Mumbai / Thane / Navi Mumbai
  ["400", 1], ["401", 1], ["402", 1], ["403", 1], ["410", 1], ["421", 1],
  // Pune
  ["411", 1], ["412", 1], ["413", 1],
  // Bangalore
  ["560", 1], ["561", 1], ["562", 1], ["563", 1],
  // Chennai
  ["600", 1], ["601", 1], ["602", 1], ["603", 1],
  // Hyderabad / Secunderabad
  ["500", 1], ["501", 1], ["502", 1], ["503", 1], ["504", 1],
  // Kolkata
  ["700", 1], ["701", 1], ["702", 1], ["703", 1],
  // Ahmedabad
  ["380", 1], ["381", 1], ["382", 1], ["383", 1],

  // ── Tier 2 — State Capitals & Large Cities ───────────────────────────────
  // Jaipur
  ["302", 2], ["303", 2], ["304", 2], ["305", 2],
  // Lucknow
  ["226", 2], ["227", 2],
  // Kanpur
  ["208", 2],
  // Nagpur
  ["440", 2], ["441", 2],
  // Indore
  ["452", 2], ["453", 2],
  // Bhopal
  ["462", 2], ["463", 2],
  // Surat
  ["394", 2], ["395", 2],
  // Vadodara
  ["390", 2], ["391", 2],
  // Coimbatore
  ["641", 2], ["642", 2],
  // Kochi / Ernakulam
  ["682", 2], ["683", 2], ["684", 2], ["685", 2],
  // Thiruvananthapuram
  ["695", 2],
  // Visakhapatnam
  ["530", 2], ["531", 2],
  // Patna
  ["800", 2], ["801", 2],
  // Ranchi
  ["834", 2], ["835", 2],
  // Bhubaneswar
  ["751", 2], ["752", 2],
  // Chandigarh / Mohali
  ["160", 2],
  // Amritsar
  ["143", 2],
  // Ludhiana
  ["141", 2],
  // Srinagar
  ["190", 2], ["191", 2],
  // Jammu
  ["180", 2], ["181", 2],
  // Dehradun
  ["248", 2],
  // Guwahati
  ["781", 2], ["782", 2],
  // Raipur
  ["492", 2], ["493", 2],
  // Varanasi
  ["221", 2], ["222", 2],
  // Agra
  ["282", 2], ["283", 2],
  // Meerut
  ["250", 2], ["251", 2],
  // Nashik
  ["422", 2], ["423", 2],
  // Aurangabad
  ["431", 2], ["432", 2],
  // Madurai
  ["625", 2], ["626", 2],
  // Tiruchirappalli
  ["620", 2], ["621", 2],
  // Mysore
  ["570", 2], ["571", 2],
  // Mangalore
  ["575", 2], ["576", 2],
  // Kozhikode
  ["673", 2], ["674", 2],
  // Vijayawada
  ["520", 2], ["521", 2],
  // Warangal
  ["506", 2],
  // Udaipur
  ["313", 2],
  // Jodhpur
  ["342", 2], ["343", 2],
  // Kota
  ["324", 2], ["325", 2],
  // Bhopal already added above
  // Shimla
  ["171", 2],
  // Panaji (Goa)
  ["403", 1], // Goa shares with Mumbai range — already tier 1
  // Gangtok
  ["737", 2],
  // Aizawl
  ["796", 2],
  // Imphal
  ["795", 2],
  // Itanagar
  ["791", 2],
  // Kohima
  ["797", 2],
  // Agartala
  ["799", 2],
]);

// ── City → Pincode Prefix Map ─────────────────────────────────────────────────
// Used by CityTierService to build conditions.pincodes on auto-generated ShippingRules.
// Key: lowercase city name. Value: array of 3-digit pincode prefixes.
export const CITY_PINCODE_PREFIXES = new Map([
  // Tier 1 — Major Metros
  ["mumbai",            ["400", "401", "402", "403", "410"]],
  ["thane",             ["400", "401", "421"]],
  ["navi mumbai",       ["400", "410"]],
  ["delhi",             ["110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125"]],
  ["bangalore",         ["560", "561", "562", "563"]],
  ["bengaluru",         ["560", "561", "562", "563"]],
  ["chennai",           ["600", "601", "602", "603"]],
  ["hyderabad",         ["500", "501", "502", "503", "504"]],
  ["kolkata",           ["700", "701", "702", "703"]],
  ["pune",              ["411", "412", "413"]],
  ["ahmedabad",         ["380", "381", "382", "383"]],
  // Tier 2 — State Capitals & Large Cities
  ["jaipur",            ["302", "303", "304", "305"]],
  ["lucknow",           ["226", "227"]],
  ["kanpur",            ["208"]],
  ["nagpur",            ["440", "441"]],
  ["indore",            ["452", "453"]],
  ["bhopal",            ["462", "463"]],
  ["surat",             ["394", "395"]],
  ["vadodara",          ["390", "391"]],
  ["coimbatore",        ["641", "642"]],
  ["kochi",             ["682", "683", "684", "685"]],
  ["thiruvananthapuram",["695"]],
  ["trivandrum",        ["695"]],
  ["visakhapatnam",     ["530", "531"]],
  ["vizag",             ["530", "531"]],
  ["patna",             ["800", "801"]],
  ["ranchi",            ["834", "835"]],
  ["bhubaneswar",       ["751", "752"]],
  ["chandigarh",        ["160"]],
  ["amritsar",          ["143"]],
  ["ludhiana",          ["141"]],
  ["srinagar",          ["190", "191"]],
  ["jammu",             ["180", "181"]],
  ["dehradun",          ["248"]],
  ["guwahati",          ["781", "782"]],
  ["raipur",            ["492", "493"]],
  ["varanasi",          ["221", "222"]],
  ["agra",              ["282", "283"]],
  ["meerut",            ["250", "251"]],
  ["nashik",            ["422", "423"]],
  ["aurangabad",        ["431", "432"]],
  ["madurai",           ["625", "626"]],
  ["tiruchirappalli",   ["620", "621"]],
  ["trichy",            ["620", "621"]],
  ["mysore",            ["570", "571"]],
  ["mangalore",         ["575", "576"]],
  ["kozhikode",         ["673", "674"]],
  ["calicut",           ["673", "674"]],
  ["vijayawada",        ["520", "521"]],
  ["warangal",          ["506"]],
  ["udaipur",           ["313"]],
  ["jodhpur",           ["342", "343"]],
  ["kota",              ["324", "325"]],
  ["shimla",            ["171"]],
  ["panaji",            ["403"]],
  ["goa",               ["403"]],
  ["gangtok",           ["737"]],
  ["aizawl",            ["796"]],
  ["imphal",            ["795"]],
  ["itanagar",          ["791"]],
  ["kohima",            ["797"]],
  ["agartala",          ["799"]],
  ["shillong",          ["793"]],
  ["dispur",            ["781", "782"]],
  // Tier 3 — Semi-urban / District towns
  ["satana",            ["423"]],
  ["shirdi",            ["423"]],
  ["malegaon",          ["423"]],
  ["latur",             ["413"]],
  ["nanded",            ["431"]],
  ["kolhapur",          ["416"]],
  ["sangli",            ["416"]],
  ["solapur",           ["413"]],
  ["ahmednagar",        ["414"]],
  ["akola",             ["444"]],
  ["amravati",          ["444"]],
  ["dhule",             ["424"]],
  ["jalgaon",           ["425"]],
  ["parbhani",          ["431"]],
  ["osmanabad",         ["413"]],
  ["beed",              ["431"]],
  ["wardha",            ["442"]],
  ["yavatmal",          ["445"]],
  ["buldhana",          ["443"]],
  ["hingoli",           ["431"]],
  ["nandurbar",         ["425"]],
  ["gondia",            ["441"]],
  ["gadchiroli",        ["442"]],
  ["chandrapur",        ["442"]],
]);

/**
 * Get the list of 3-digit pincode prefixes for a city name.
 * Case-insensitive. Returns empty array if city is unknown.
 * @param {string} city
 * @returns {string[]}
 */
export function getPrefixesForCity(city) {
  if (!city) return [];
  return CITY_PINCODE_PREFIXES.get(city.trim().toLowerCase()) || [];
}

/**
 * Check if a city name is in the known city map.
 * @param {string} city
 * @returns {boolean}
 */
export function isKnownCity(city) {
  if (!city) return false;
  return CITY_PINCODE_PREFIXES.has(city.trim().toLowerCase());
}

/**
 * Search city names by prefix (for typeahead).
 * @param {string} q - search query
 * @returns {string[]} matching city names (title-cased)
 */
export function searchCityNames(q) {
  if (!q) return [];
  const query = q.trim().toLowerCase();
  const results = [];
  for (const key of CITY_PINCODE_PREFIXES.keys()) {
    if (key.startsWith(query)) {
      results.push(key.charAt(0).toUpperCase() + key.slice(1));
    }
  }
  return results.sort();
}

/**
 * Get the logistics tier for a pincode.
 * @param {string|number} pincode - 6-digit Indian pincode
 * @returns {1|2|3}
 */
export function getTier(pincode) {
  if (!pincode) return 3;
  const str = String(pincode).trim();
  if (str.length < 3) return 3;

  const prefix3 = str.slice(0, 3);
  if (TIER_MAP.has(prefix3)) return TIER_MAP.get(prefix3);

  return 3;
}

/**
 * Recommend the preferred provider name based on destination tier.
 *
 * Preference logic:
 *   Tier 1/2 → Shiprocket (faster SLA, better tracking UX)
 *   Tier 3   → India Post (widest last-mile coverage in rural India)
 *
 * The factory's rule engine takes precedence; this is only used when no
 * ShippingRule matches and there are multiple active providers to pick from.
 *
 * @param {string|number} destinationPincode
 * @returns {"shiprocket"|"indiapost"|"shipmozo"|null}
 */
export function recommendProvider(destinationPincode) {
  const tier = getTier(destinationPincode);
  if (tier === 1 || tier === 2) return "shiprocket";
  return "indiapost";
}
