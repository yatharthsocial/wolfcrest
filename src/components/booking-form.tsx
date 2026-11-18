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

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+974", country: "Qatar" },
  { code: "+968", country: "Oman" },
  { code: "+965", country: "Kuwait" },
  { code: "+973", country: "Bahrain" },
  { code: "+44", country: "UK" },
  { code: "+1", country: "USA / Canada" },
  { code: "+61", country: "Australia" },
  { code: "+64", country: "New Zealand" },
  { code: "+65", country: "Singapore" },
  { code: "+60", country: "Malaysia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+353", country: "Ireland" },
  { code: "+27", country: "South Africa" },
];

type Status = "idle" | "sending" | "sent" | "error";
type Errors = { name?: string; phone?: string };

function validate(name: string, phone: string): Errors {
  const errors: Errors = {};
  if (name.trim().length < 2) errors.name = "Please enter your name";
  const digits = phone.replace(/\D/g, "");
  if (!digits) errors.phone = "Please enter your phone number";
  else if (digits.length < 6 || digits.length > 14) errors.phone = "Please enter a valid phone number";
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

  // Focus once the card has faded in (it can't take focus while still inert)
  useEffect(() => {
    const t = window.setTimeout(() => nameInput.current?.focus({ preventScroll: true }), 450);
    return () => window.clearTimeout(t);
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const found = validate(name, phone);
    setErrors(found);
    if (found.name || found.phone) return;

    const number = `${code} ${phone.trim()}`;
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
          Thank you, {name.trim().split(/\s+/)[0]}. Our team will reach out on {code} {phone.trim()} to confirm
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
                onChange={(e) => setCode(e.target.value)}
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
              inputMode="tel"
              autoComplete="tel-national"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "book-phone-error" : undefined}
              placeholder="98765 43210"
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
