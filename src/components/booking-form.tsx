"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  COMMENT_MAX,
  NAME_MAX,
  cleanName,
  cleanPhone,
  countryCodes,
  findCountry,
  validate,
  validatePhone,
  type BookingRequest,
  type Errors,
} from "@/lib/booking";

const GOLD = "#F2C46D";

type Status = "idle" | "sending" | "sent" | "error";

const label = "mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/60";
const field =
  "rounded-none border border-white/20 bg-white/[0.04] px-4 text-[15px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#F2C46D] aria-invalid:border-red-400/80";

/**
 * Bookings are posted to /api/book, which checks them again and adds a row to
 * the bookings Google Sheet. onBack shows a "Back to poster" link; leave it
 * out where there is no poster to go back to.
 */
export function BookingForm({ onBack, onDone }: { onBack?: () => void; onDone: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState(countryCodes[0].code);
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
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
    if (status === "sending") return;
    const found = validate(name, phone, country);
    setErrors(found);
    if (found.name || found.phone) return;

    const booking: BookingRequest = { name: name.trim(), code, phone, comment: comment.trim(), website };
    setStatus("sending");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (res.ok) return setStatus("sent");
      // The server re-checks; show its field errors if it disagrees with the form
      const data = (await res.json().catch(() => null)) as { errors?: Errors } | null;
      if (data?.errors) {
        setErrors(data.errors);
        return setStatus("idle");
      }
      setStatus("error");
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
            maxLength={NAME_MAX}
            value={name}
            onChange={(e) => setName(cleanName(e.target.value))}
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
            maxLength={COMMENT_MAX}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Anything you'd like us to know"
            className={`${field} w-full resize-none py-3`}
          />
        </div>
      </div>

      {/* Honeypot: hidden from people and screen readers, filled in by bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      {status === "error" && (
        <p role="alert" className="mt-4 text-[13px] text-red-300">
          Couldn&apos;t send just now. Please try again in a moment.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex h-[52px] w-full cursor-pointer items-center justify-center gap-4 bg-[#F2C46D] px-6 text-[13px] font-bold uppercase tracking-[0.18em] text-[#0A0908] transition-colors hover:bg-[#F7D48E] disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Book your slot"}
        <span aria-hidden className="text-lg leading-none tracking-normal">→</span>
      </button>
    </form>
  );
}
