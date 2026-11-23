/**
 * The Wolf Crest: "Book your slot" bookings -> Google Sheet
 *
 * The website's /api/book route posts each booking here and this script adds
 * it as a row. Setup, once:
 *
 *  1. Create a Google Sheet (e.g. "Dubai Property Connect – Bookings").
 *  2. In the sheet: Extensions > Apps Script. Delete what's there and paste
 *     this whole file in.
 *  3. Change SECRET below to a long random string, and save.
 *  4. Deploy > New deployment > type "Web app".
 *       Execute as:     Me
 *       Who has access: Anyone
 *     Deploy, allow the permissions, and copy the Web app URL (ends in /exec).
 *  5. Give the site two env vars (in .env.local and in Vercel):
 *       BOOKING_SHEET_URL=<the /exec URL>
 *       BOOKING_SHEET_SECRET=<the same SECRET as below>
 *
 * "Anyone" only means the URL can be called without a Google login. Requests
 * without the secret are refused, and the sheet itself stays private.
 *
 * After editing this script later: Deploy > Manage deployments > edit (pencil)
 * > Version: New version > Deploy. That keeps the same URL.
 */

const SECRET = "CHANGE-ME-to-a-long-random-string";
const SHEET_NAME = "Bookings";
const HEADERS = ["Submitted at", "Name", "WhatsApp number", "Country", "Comment", "Page"];

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "Invalid JSON" });
  }
  if (data.secret !== SECRET) return reply({ ok: false, error: "Unauthorized" });

  // Two bookings arriving together must not write over each other's row
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      text(data.name),
      text(data.whatsapp),
      text(data.country),
      text(data.comment),
      text(data.page),
    ]);
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

/** Creates the Bookings tab with a header row the first time it's needed */
function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("dd mmm yyyy, hh:mm");
  }
  return sheet;
}

/**
 * Stores values as plain text. Without the leading apostrophe a number like
 * "+91 98765 43210" (or anything starting with = + - @) would be read as a
 * formula.
 */
function text(value) {
  const s = String(value == null ? "" : value).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
