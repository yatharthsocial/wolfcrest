/**
 * The guided assistant's script. It answers common questions from the
 * site's own content and hands every real enquiry to a person on WhatsApp,
 * phone or email, with what the visitor chose already filled in. There is no
 * AI and nothing is stored: everything runs in the visitor's browser.
 */
import { contact, mapsLink } from "@/content/contact";

export type Option =
  | { label: string; topic: Topic }
  | { label: string; budget: string }
  | { label: string; href: string; external?: boolean };

export type Reply = { text: string; options?: Option[] };

export type Topic =
  | "menu"
  | "buy"
  | "offplan"
  | "invest"
  | "rent"
  | "office"
  | "advisor"
  | "india";

const topicNames: Record<Topic, string> = {
  menu: "",
  buy: "buying a home in Dubai",
  offplan: "off-plan projects in Dubai",
  invest: "investing in Dubai property",
  rent: "renting or leasing in Dubai",
  office: "visiting your office",
  advisor: "speaking to an advisor",
  india: "investing in Dubai from India",
};

export const whatsappLink = (message: string) =>
  `${contact.whatsapp.href}?text=${encodeURIComponent(message)}`;

const budgets: Option[] = [
  { label: "Under AED 1M", budget: "under AED 1M" },
  { label: "AED 1M – 3M", budget: "AED 1M – 3M" },
  { label: "AED 3M – 10M", budget: "AED 3M – 10M" },
  { label: "Above AED 10M", budget: "above AED 10M" },
];

/** Ways to reach a person, with the visitor's interest already written */
export function handoff(message: string): Option[] {
  return [
    { label: "Continue on WhatsApp", href: whatsappLink(message), external: true },
    { label: `Call ${contact.phone.label}`, href: contact.phone.href },
    {
      label: "Email us",
      href: `${contact.email.href}?subject=${encodeURIComponent("Enquiry from the website")}&body=${encodeURIComponent(message)}`,
    },
  ];
}

export const mainMenu: Option[] = [
  { label: "Buy a home", topic: "buy" },
  { label: "Off-plan projects", topic: "offplan" },
  { label: "Investment advice", topic: "invest" },
  { label: "Rent or lease", topic: "rent" },
  { label: "Visit our office", topic: "office" },
  { label: "Talk to an advisor", topic: "advisor" },
];

export const greeting: Reply = {
  text: "Hello, welcome to The Wolf Crest. I can answer a few quick questions or connect you with one of our advisors. What are you looking for?",
  options: mainMenu,
};

export function replyFor(topic: Topic): Reply {
  switch (topic) {
    case "menu":
      return { text: "Of course. What would you like to know about?", options: mainMenu };
    case "buy":
      return {
        text: "We help you find and buy luxury homes across Dubai, from waterfront apartments to family villas, and handle every step through to the keys. What budget do you have in mind?",
        options: budgets,
      };
    case "offplan":
      return {
        text: "Off-plan means buying directly from the developer before completion, usually at launch prices with a payment plan spread over construction. We work with Dubai’s leading developers to find the right project for you. What budget are you considering?",
        options: [...budgets, { label: "See our partners", href: "/partners" }],
      };
    case "invest":
      return {
        text: "We advise on where and what to buy, whether you want rental income or long-term growth, and explain the numbers clearly before you commit. What budget are you working with?",
        options: budgets,
      };
    case "rent":
      return {
        text: "We lease luxury residences for tenants and manage lettings for landlords. An advisor can share what’s available and the current market rents.",
        options: [
          ...handoff("Hi, I'm interested in renting or leasing a property in Dubai."),
          { label: "Something else", topic: "menu" },
        ],
      };
    case "office":
      return {
        text: `You’ll find us at ${contact.address.lines.join(", ")}, close to ${contact.address.landmark}.`,
        options: [
          { label: "Get directions", href: mapsLink, external: true },
          { label: "Contact details", href: "/dubai-property-connect" },
          { label: "Something else", topic: "menu" },
        ],
      };
    case "advisor":
      return {
        text: "Happy to connect you. Our advisors usually reply fastest on WhatsApp, or you can call or email.",
        options: handoff("Hi, I'd like to speak to an advisor at The Wolf Crest."),
      };
    case "india":
      return {
        text: "We help buyers from India invest in Dubai and guide you remotely, from your first questions through to handover. Would you like to talk it through with an advisor?",
        options: [
          ...handoff("Hi, I'm in India and interested in investing in Dubai property."),
          { label: "Something else", topic: "menu" },
        ],
      };
  }
}

/** After a budget is chosen: summarise and hand off */
export function replyForBudget(topic: Topic, budget: string): Reply {
  const interest = topicNames[topic] || "property in Dubai";
  return {
    text: `Thank you. An advisor can share options for ${interest} at ${budget}. How would you like to continue?`,
    options: [
      ...handoff(`Hi, I'm interested in ${interest}. My budget is ${budget}.`),
      { label: "Something else", topic: "menu" },
    ],
  };
}

const keywords: [Topic, RegExp][] = [
  ["office", /\b(office|address|where|located|location|visit|map|directions?)\b/],
  ["india", /\b(india|indian|mangalore|mangaluru|nri|inr|rupees?|lakhs?|crores?)\b|₹/],
  ["offplan", /\b(off[- ]?plan|launch|new development|payment plan|developer|handover)\b/],
  ["invest", /\b(invest|investment|roi|returns?|yield|golden visa|visa|appreciation)\b/],
  ["rent", /\b(rent|rental|lease|leasing|tenant|landlord)\b/],
  ["buy", /\b(buy|buying|purchase|villa|apartment|penthouse|townhouse|home|flat|property)\b/],
  ["advisor", /\b(call|phone|number|email|contact|agent|advisor|adviser|human|person|talk|speak|whatsapp)\b/],
];

/** Free-text questions: match a topic, otherwise pass it to a person */
export function replyForText(input: string): { topic: Topic | null; reply: Reply } {
  const text = input.toLowerCase();
  if (/^\s*(hi|hello|hey|salaam|salam|namaste|good (morning|afternoon|evening))\b/.test(text)) {
    return { topic: null, reply: { text: "Hello! What can I help you with today?", options: mainMenu } };
  }
  if (/\b(thanks|thank you|thx|great|perfect)\b/.test(text)) {
    return {
      topic: null,
      reply: { text: "You’re welcome. Is there anything else I can help with?", options: mainMenu },
    };
  }
  for (const [topic, pattern] of keywords) {
    if (pattern.test(text)) return { topic, reply: replyFor(topic) };
  }
  return {
    topic: null,
    reply: {
      text: "Good question. One of our advisors can answer that properly. Continue on WhatsApp and they’ll pick it up from here.",
      options: [...handoff(input.trim()), { label: "Something else", topic: "menu" }],
    },
  };
}
