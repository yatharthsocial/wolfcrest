/**
 * Contact details and social profiles, used by the Dubai Property Connect page and the
 * social icons on the home page. Change them here and the site updates.
 */

export const contact = {
  phone: { label: "+971 50 420 8578", href: "tel:+971504208578" },
  // India line, also printed on the Dubai Property Connect poster's "Call now" bar
  indiaPhone: { label: "+91 91485 58578", href: "tel:+919148558578" },
  whatsapp: { label: "+91 91485 58578", href: "https://wa.me/919148558578" },
  email: { label: "info@thewolfcrest.com", href: "mailto:info@thewolfcrest.com" },
  address: {
    lines: ["Office No. B6, next to Al Garhoud Hospital", "Behind DHL Warehouse", "Al Garhoud, Dubai, UAE"],
    landmark: "GGICO Metro Station",
    // Google Maps search for the landmark beside the office
    mapQuery: "Al Garhoud Private Hospital, Al Garhoud, Dubai",
  },
};

export type SocialName = "Instagram" | "Facebook" | "LinkedIn" | "YouTube" | "TikTok";

export const socials: { name: SocialName; href: string }[] = [
  { name: "Instagram", href: "https://www.instagram.com/thewolfcrestdubai" },
  { name: "Facebook", href: "https://www.facebook.com/people/The-Wolf-Crest-Real-Estate-Dubai/61588344094396/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/the-wolf-crest-real-estate-430023415" },
  { name: "YouTube", href: "https://www.youtube.com/channel/UCynsl25kyGcu1Z_vZOAQlmw" },
  { name: "TikTok", href: "https://www.tiktok.com/@the.wolf.crest" },
];

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address.mapQuery)}`;
