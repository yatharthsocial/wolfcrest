import { contact, socials } from "@/content/contact";

/**
 * One source of truth for how the business is described to search engines
 * and AI assistants: page metadata, Open Graph, JSON-LD and llms.txt.
 */

export const SITE_URL = "https://thewolfcrest.com";

export const site = {
  name: "The Wolf Crest Real Estate",
  shortName: "The Wolf Crest",
  alternateNames: ["The Wolf Crest", "Wolf Crest Real Estate", "Wolfcrest", "The Wolf Crest Dubai"],
  slogan: "Where Power Meets Prestige",
  tagline: "Luxury Curated Residences For Long Term Living",
  description:
    "The Wolf Crest Real Estate is a Dubai property advisory in Al Garhoud for luxury residential sales and leasing, off-plan developments, investment advisory and end-to-end client representation, including for investors buying from India.",
  locale: "en_AE",
  email: "info@thewolfcrest.com",
  telephone: "+971504208578",
  founders: [
    { name: "Godwin Dsouza", jobTitle: "Founder & CEO" },
    { name: "Pooja Preetham", jobTitle: "Co-founder" },
  ],
} as const;

export const services = [
  {
    name: "Luxury Residential Sales & Leasing",
    description:
      "Villas, penthouses and signature apartments across Dubai’s most sought-after communities, bought, sold and leased with discretion: valuation and pricing strategy, private and off-market listings, qualified buyer and tenant screening, and negotiation through to transfer.",
  },
  {
    name: "Off-Plan & New Developments",
    description:
      "Early access to Dubai’s most anticipated launches with an honest view of the developer, location and payment plan: priority allocation at launch, developer and project due diligence, payment plan structuring, and snagging and handover support.",
  },
  {
    name: "Investment Advisory",
    description:
      "Clear, data-led guidance for building and growing a property portfolio in the UAE: yield and capital growth analysis, portfolio planning and review, market and community research, and resale and exit strategy.",
  },
  {
    name: "End-to-End Client Representation",
    description:
      "One dedicated advisor from the first conversation to handover and after: a single point of contact, mortgage and conveyancing coordination, documentation and DLD transfer, and after-sale and property management support.",
  },
] as const;

/** Dubai Property Connect: the Property & Investment Summit in Mangaluru */
export const summit = {
  name: "Dubai Property Connect: Property & Investment Summit",
  description:
    "Meet Dubai’s leading developers in person in Mangaluru. The Wolf Crest Real Estate presents a property and investment summit for buyers in India, with Dubai developers and guidance on the UAE 10-year Golden Visa.",
  startDate: "2026-12-18T17:00:00+05:30",
  venue: "The Avatar",
  city: "Mangaluru",
  region: "Karnataka",
  country: "IN",
  developers: ["Danube Properties", "Binghatti", "Sobha Realty", "Ellington Properties", "BNW Developments", "Meraki Developers"],
} as const;

export const pages = [
  { path: "/", name: "Home", changeFrequency: "weekly", priority: 1 },
  { path: "/about", name: "About", changeFrequency: "monthly", priority: 0.8 },
  { path: "/service", name: "Services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/partners", name: "Our Partners", changeFrequency: "monthly", priority: 0.7 },
  { path: "/media", name: "Media", changeFrequency: "weekly", priority: 0.6 },
  { path: "/dubai-property-connect", name: "Dubai Property Connect", changeFrequency: "weekly", priority: 0.9 },
] as const;

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/** The business itself, on every page */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": ORG_ID,
    name: site.name,
    alternateName: site.alternateNames,
    slogan: site.slogan,
    description: site.description,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
    image: `${SITE_URL}/opengraph-image.jpg`,
    email: site.email,
    telephone: site.telephone,
    contactPoint: [
      { "@type": "ContactPoint", telephone: site.telephone, contactType: "sales", areaServed: "AE", availableLanguage: ["English"] },
      { "@type": "ContactPoint", telephone: contact.indiaPhone.href.replace("tel:", ""), contactType: "sales", areaServed: "IN", availableLanguage: ["English"] },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${contact.address.lines[0]}, ${contact.address.lines[1]}`,
      addressLocality: "Al Garhoud",
      addressRegion: "Dubai",
      addressCountry: "AE",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address.mapQuery)}`,
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "India" },
    ],
    founder: site.founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.jobTitle })),
    knowsAbout: [
      "Dubai real estate",
      "Luxury property in Dubai",
      "Off-plan property in Dubai",
      "Property investment in the UAE",
      "UAE Golden Visa through property investment",
      "Dubai property for NRI and Indian investors",
      "Residential leasing in Dubai",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Real estate services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.description },
      })),
    },
    sameAs: socials.map((s) => s.href),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: site.shortName,
    alternateName: site.name,
    url: SITE_URL,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
}

export function servicesJsonLd() {
  return services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    serviceType: s.name,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: "Dubai" },
  }));
}

export function summitJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: summit.name,
    description: summit.description,
    startDate: summit.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${SITE_URL}/dubai-property-connect/opengraph-image.jpg`],
    location: {
      "@type": "Place",
      name: `${summit.venue}, ${summit.city}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: summit.city,
        addressRegion: summit.region,
        addressCountry: summit.country,
      },
    },
    organizer: { "@type": "Organization", "@id": ORG_ID, name: site.name, url: SITE_URL },
    performer: summit.developers.map((name) => ({ "@type": "Organization", name })),
    url: `${SITE_URL}/dubai-property-connect`,
  };
}

/**
 * Metadata for an inner page: its own title, description, canonical URL and
 * share preview. Open Graph is replaced as a whole per page in Next.js, so the
 * shared fields are repeated here rather than inherited from the layout.
 */
const shareImageAlt = "The Wolf Crest Real Estate crest and logo over the Dubai skyline: Where Power Meets Prestige";

export function pageMetadata({
  path,
  title,
  description,
  image = { url: "/opengraph-image.jpg", alt: shareImageAlt },
}: {
  path: string;
  title: string;
  description: string;
  /** A 1200x630 share image for this page; defaults to the site-wide one */
  image?: { url: string; alt: string };
}) {
  const fullTitle = `${title} | The Wolf Crest`;
  const images = [{ ...image, width: 1200, height: 630 }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website" as const, siteName: site.name, locale: site.locale, url: path, title: fullTitle, description, images },
    twitter: { card: "summary_large_image" as const, title: fullTitle, description, images },
  };
}
