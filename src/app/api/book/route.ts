import { COMMENT_MAX, countryCodes, validate, type BookingRequest } from "@/lib/booking";

/**
 * Saves a "Book your slot" request as a new row in the bookings Google Sheet.
 *
 * The sheet is written by a Google Apps Script web app (see
 * google-apps-script/bookings.gs for the script and setup). Its URL and a
 * shared secret live in env vars, so neither ever reaches the browser:
 *   BOOKING_SHEET_URL     the web app URL ending in /exec
 *   BOOKING_SHEET_SECRET  the same value as SECRET in the script
 */
export async function POST(request: Request) {
  const url = process.env.BOOKING_SHEET_URL;
  const secret = process.env.BOOKING_SHEET_SECRET;
  if (!url || !secret) {
    console.error("[book] BOOKING_SHEET_URL or BOOKING_SHEET_SECRET is not set");
    return Response.json({ error: "Bookings are not set up yet" }, { status: 503 });
  }

  let body: Partial<BookingRequest>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot filled in: pretend it worked so the bot moves on, but save nothing
  if (body.website) return Response.json({ ok: true });

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, COMMENT_MAX) : "";
  const country = countryCodes.find((c) => c.code === body.code);
  if (!country) return Response.json({ error: "Unknown country code" }, { status: 400 });

  const errors = validate(name, phone, country);
  if (errors.name || errors.phone) return Response.json({ errors }, { status: 422 });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        name,
        whatsapp: `${country.code} ${phone}`,
        country: country.country,
        comment,
        page: request.headers.get("referer") ?? "",
      }),
      // Apps Script answers from a redirect; fetch follows it to read the result
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !result?.ok) {
      console.error("[book] sheet rejected the booking", res.status, result?.error);
      return Response.json({ error: "Couldn't save the booking" }, { status: 502 });
    }
  } catch (err) {
    console.error("[book] couldn't reach the sheet", err);
    return Response.json({ error: "Couldn't save the booking" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
