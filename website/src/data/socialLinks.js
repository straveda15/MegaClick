import { WA_WEB_URL } from "../lib/whatsapp";

// Single source of truth for MegaClick's social profiles.
//
// `url`    – the full profile link
// `handle` – the text shown next to the icon
//
// Used by the Contact page and the Footer.
// WhatsApp links should also use `openWhatsApp` from ../lib/whatsapp as their
// click handler (phone app / WhatsApp Web redirect + pre-filled message).
export const SOCIAL_PROFILES = {
  facebook: {
    label: "Facebook",
    url: "https://www.facebook.com/people/MegaClick-Official/61589437700503/",
    handle: "MegaClick Official",
  },
  instagram: {
    label: "Instagram",
    url: "https://www.instagram.com/megaclickofficial/",
    handle: "@megaclickofficial",
  },
  whatsapp: {
    label: "WhatsApp",
    url: WA_WEB_URL,
    handle: "+91 99216 11911",
  },
};
