"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

/**
 * Entries go straight into the Dubai Property Connect Google Form, so they
 * show up in its Responses tab (and linked sheet) like any other response.
 */
const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdXS9TO_oOKfVMosMoBGOjMBxwFUpVbSrSnVpxx6WvZogoNmw/formResponse";
const ENTRY = {
  name: "entry.1409889583", // "1. Full Name"
  phone: "entry.865948833", // "2. WhatsApp Number"
  /**
   * The Google Form has no comment question yet. Add a "Comment" paragraph
   * question to it and put its entry id here (e.g. "entry.123456789").
   * Until then, a comment is added after the number so it isn't lost.
   */
  comment: null as string | null,
};

const GOLD = "#F2C46D";

/**
 * Mobile numbers per country, without the country code or a leading 0.
 * The form asks for a WhatsApp number, so only mobile ranges are accepted.
 * `max` caps typing; `pattern` is the full check; `example` is the placeholder.
 */
const countryCodes = [
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

type Country = (typeof countryCodes)[number];

const findCountry = (code: string) => countryCodes.find((c) => c.code === code) ?? countryCodes[0];

/**
 * Keeps only digits. A pasted number in international form (+91…, 0091…)
 * loses its country code, and a leading trunk 0 (098…) is dropped.
 * Length is checked by the caller.
 */
function cleanPhone(value: string, country: Country) {
  const international = /^\s*(\+|00)/.test(value);
  let digits = value.replace(/\D/g, "");
  if (international) {
    if (digits.startsWith("00")) digits = digits.slice(2);
    const cc = country.code.slice(1);
    if (digits.startsWith(cc)) digits = digits.slice(cc.length);
  }
  return digits.replace(/^0+/, "");
}

type Status = "idle" | "sending" | "sent" | "error";
type Errors = { name?: string; phone?: string };

function validatePhone(phone: string, country: Country) {
  if (!phone) return "Please enter your phone number";
  if (!country.pattern.test(phone))
    return `Enter a valid ${country.country} mobile number (${country.rule})`;
  return undefined;
}

function validate(name: string, phone: string, country: Country): Errors {
  const errors: Errors = {};
  if (name.trim().length < 2) errors.name = "Please enter your name";
  const phoneError = validatePhone(phone, country);
  if (phoneError) errors.phone = phoneError;
  return errors;
}

const label = "mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/60";
const field =
  "rounded-none border border-white/20 bg-white/[0.04] px-4 text-[15px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#F2C46D] aria-invalid:border-red-400/80";

/** onBack shows a "Back to poster" link; leave it out where there is no poster to go back to */
export function BookingForm({ onBack, onDone }: { onBack?: () => void; onDone: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState(countryCodes[0].code);
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const nameInput = useRef<HTMLInputElement>(null);
  const country = findCountry(code);

  // Focus once the card has faded in (it can't take focus while still inert)
  useEffect(() => {
    const t = window.setTimeout(() => nameInput.current?.focus({ preventScroll: true }), 450);
    return () => window.clearTimeout(t);
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const found = validate(name, phone, country);
    setErrors(found);
    if (found.name || found.phone) return;

    const number = `${code} ${phone}`;
    const note = comment.trim();
    const body = new URLSearchParams();
    body.set(ENTRY.name, name.trim());
    if (ENTRY.comment) {
      body.set(ENTRY.phone, number);
      if (note) body.set(ENTRY.comment, note);
    } else {
      body.set(ENTRY.phone, note ? `${number} | Comment: ${note}` : number);
    }

    setStatus("sending");
    try {
      // Google Forms doesn't allow reading the reply from another site, so a
      // request that goes through is treated as sent
      await fetch(FORM_ACTION, { method: "POST", mode: "no-cors", body });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start" role="status">
        <span className="mb-5 flex size-12 items-center justify-center rounded-full" style={{ background: GOLD }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#0A0908" strokeWidth="2" className="size-5" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-white">Your slot is requested</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-white/65">
          Thank you, {name.trim().split(/\s+/)[0]}. Our team will reach out on {code} {phone} to confirm
          your slot for 18 Dec at The Avatar, Mangaluru.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-8 inline-flex h-12 cursor-pointer items-center bg-[#F2C46D] px-6 text-[12px] font-bold uppercase tracking-[0.18em] text-[#0A0908] transition-colors hover:bg-[#F7D48E]"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex w-fit cursor-pointer items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> Back to poster
        </button>
      )}

      <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
        18 Dec · The Avatar, Mangaluru
      </span>
      <h2 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-white">Book your slot</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-white/55">
        Leave your details and our team will confirm your place at Dubai Property Connect.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="book-name" className={label}>
            Name <span style={{ color: GOLD }}>*</span>
          </label>
          <input
            ref={nameInput}
            id="book-name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "book-name-error" : undefined}
            placeholder="Your full name"
            className={`${field} h-12 w-full`}
          />
          {errors.name && (
            <p id="book-name-error" className="mt-1.5 text-[12px] text-red-300">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="book-phone" className={label}>
            Phone number <span style={{ color: GOLD }}>*</span>
          </label>
          <div className="flex">
            {/* Shows just the code; the full country list opens from the native picker */}
            <div className="relative flex h-12 w-[6.25rem] shrink-0 items-center justify-between border border-r-0 border-white/20 bg-white/[0.04] pl-4 pr-3.5 text-[15px] text-white transition-colors focus-within:border-[#F2C46D]">
              <span aria-hidden>{code}</span>
              <svg viewBox="0 0 12 8" fill="none" stroke="#F2C46D" strokeWidth="1.5" className="w-2.5" aria-hidden>
                <path d="M1 1.5l5 5 5-5" />
              </svg>
              <select
                aria-label="Country code"
                autoComplete="tel-country-code"
                value={code}
                onChange={(e) => {
                  const next = findCountry(e.target.value);
                  setCode(next.code);
                  // Re-check what's typed against the new country's rules
                  if (phone) setErrors((er) => ({ ...er, phone: validatePhone(phone, next) }));
                }}
                className="absolute inset-0 cursor-pointer appearance-none bg-[#141210] text-[15px] text-white opacity-0"
              >
                {countryCodes.map((c) => (
                  <option key={c.code + c.country} value={c.code}>
                    {c.code}  {c.country}
                  </option>
                ))}
              </select>
            </div>
            <input
              id="book-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel-national"
              required
              maxLength={country.max + 8 /* room for a pasted +code, cleaned on change */}
              value={phone}
              onChange={(e) => {
                const next = cleanPhone(e.target.value, country);
                // Typing stops at the country's length. A longer paste is kept
                // as is so it's flagged rather than silently cut to a wrong number
                if (next.length > country.max && next.length - phone.length <= 1) return;
                setPhone(next);
                // Once an error is showing, clear it as soon as the number is valid
                if (errors.phone) setErrors((er) => ({ ...er, phone: validatePhone(next, country) }));
              }}
              onBlur={() => {
                if (phone) setErrors((er) => ({ ...er, phone: validatePhone(phone, country) }));
              }}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "book-phone-error" : undefined}
              placeholder={country.example.replace(/\s/g, "")}
              className={`${field} h-12 w-full min-w-0 flex-1`}
            />
          </div>
          {errors.phone && (
            <p id="book-phone-error" className="mt-1.5 text-[12px] text-red-300">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="book-comment" className={label}>
            Comment <span className="font-normal normal-case tracking-normal text-white/35">(optional)</span>
          </label>
          <textarea
            id="book-comment"
            name="comment"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Anything you'd like us to know"
            className={`${field} w-full resize-none py-3`}
          />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 text-[13px] text-red-300">
          Couldn&apos;t send just now. Please check your connection and try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex h-[52px] w-full cursor-pointer items-center justify-between bg-[#F2C46D] px-6 text-[13px] font-bold uppercase tracking-[0.18em] text-[#0A0908] transition-colors hover:bg-[#F7D48E] disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Book your slot"}
        <span aria-hidden className="text-lg leading-none tracking-normal">→</span>
      </button>
    </form>
  );
}
