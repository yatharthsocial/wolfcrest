/**
 * Booking rules shared by the form (instant feedback) and the API route
 * (the check that counts, since anyone can post to the API directly).
 */

/**
 * Mobile numbers per country, without the country code or a leading 0.
 * The team confirms on WhatsApp, so only mobile ranges are accepted.
 * `max` caps typing; `pattern` is the full check; `example` is the placeholder.
 */
export const countryCodes = [
  { code: "+91", country: "India", max: 10, pattern: /^[6-9]\d{9}$/, example: "98765 43210", rule: "10 digits starting with 6–9" },
  { code: "+971", country: "UAE", max: 9, pattern: /^5[024568]\d{7}$/, example: "50 123 4567", rule: "9 digits starting with 5" },
  { code: "+966", country: "Saudi Arabia", max: 9, pattern: /^5\d{8}$/, example: "51 234 5678", rule: "9 digits starting with 5" },
  { code: "+974", country: "Qatar", max: 8, pattern: /^[3567]\d{7}$/, example: "3312 3456", rule: "8 digits starting with 3, 5, 6 or 7" },
  { code: "+968", country: "Oman", max: 8, pattern: /^[79]\d{7}$/, example: "9212 3456", rule: "8 digits starting with 7 or 9" },
  { code: "+965", country: "Kuwait", max: 8, pattern: /^[4569]\d{7}$/, example: "5001 2345", rule: "8 digits starting with 4, 5, 6 or 9" },
  { code: "+973", country: "Bahrain", max: 8, pattern: /^[36]\d{7}$/, example: "3600 1234", rule: "8 digits starting with 3 or 6" },
  { code: "+44", country: "UK", max: 10, pattern: /^7\d{9}$/, example: "7400 123456", rule: "10 digits starting with 7" },
  { code: "+1", country: "USA / Canada", max: 10, pattern: /^[2-9]\d{2}[2-9]\d{6}$/, example: "201 555 0123", rule: "10 digits" },
  { code: "+61", country: "Australia", max: 9, pattern: /^4\d{8}$/, example: "412 345 678", rule: "9 digits starting with 4" },
  { code: "+64", country: "New Zealand", max: 10, pattern: /^2\d{7,9}$/, example: "21 123 4567", rule: "8–10 digits starting with 2" },
  { code: "+65", country: "Singapore", max: 8, pattern: /^[89]\d{7}$/, example: "8123 4567", rule: "8 digits starting with 8 or 9" },
  { code: "+60", country: "Malaysia", max: 10, pattern: /^1\d{8,9}$/, example: "12 345 6789", rule: "9–10 digits starting with 1" },
  { code: "+49", country: "Germany", max: 11, pattern: /^1[567]\d{8,9}$/, example: "151 23456789", rule: "10–11 digits starting with 15, 16 or 17" },
  { code: "+33", country: "France", max: 9, pattern: /^[67]\d{8}$/, example: "6 12 34 56 78", rule: "9 digits starting with 6 or 7" },
  { code: "+353", country: "Ireland", max: 9, pattern: /^8[3-9]\d{7}$/, example: "85 012 3456", rule: "9 digits starting with 83–89" },
  { code: "+27", country: "South Africa", max: 9, pattern: /^[678]\d{8}$/, example: "71 123 4567", rule: "9 digits starting with 6, 7 or 8" },
];

export type Country = (typeof countryCodes)[number];

export const findCountry = (code: string) => countryCodes.find((c) => c.code === code) ?? countryCodes[0];

/**
 * Keeps only digits. A pasted number in international form (+91…, 0091…)
 * loses its country code, and a leading trunk 0 (098…) is dropped.
 * Length is checked by the caller.
 */
export function cleanPhone(value: string, country: Country) {
  const international = /^\s*(\+|00)/.test(value);
  let digits = value.replace(/\D/g, "");
  if (international) {
    if (digits.startsWith("00")) digits = digits.slice(2);
    const cc = country.code.slice(1);
    if (digits.startsWith(cc)) digits = digits.slice(cc.length);
  }
  return digits.replace(/^0+/, "");
}

export function validatePhone(phone: string, country: Country) {
  if (!phone) return "Please enter your phone number";
  if (!country.pattern.test(phone))
    return `Enter a valid ${country.country} mobile number (${country.rule})`;
  return undefined;
}

/** Letters in any script, spaces, and the punctuation real names use (D'Souza, Anne-Marie, K. Rao) */
const NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '’.-]+[\p{L}\p{M}]+)*\.?$/u;
/** Strips anything else as it's typed, so digits and symbols never land in the field */
export const cleanName = (value: string) => value.replace(/[^\p{L}\p{M} '’.-]/gu, "").replace(/\s{2,}/g, " ");

export const NAME_MAX = 80;
export const COMMENT_MAX = 1000;

export type Errors = { name?: string; phone?: string };

export function validate(name: string, phone: string, country: Country): Errors {
  const errors: Errors = {};
  const trimmed = name.trim();
  if ((trimmed.match(/\p{L}/gu)?.length ?? 0) < 2) errors.name = "Please enter your name";
  else if (trimmed.length > NAME_MAX || !NAME_PATTERN.test(trimmed)) errors.name = "Please use letters only";
  const phoneError = validatePhone(phone, country);
  if (phoneError) errors.phone = phoneError;
  return errors;
}

/** What the form posts to /api/book */
export type BookingRequest = {
  name: string;
  code: string;
  phone: string;
  comment?: string;
  /** Hidden field real people never fill in; bots that fill every field get dropped */
  website?: string;
};
