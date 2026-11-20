// Format values in one place so every page writes money, times and seats the same way.

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** 2500 -> "₦2,500" */
export function naira(amount: number): string {
  const n = Math.round(Number(amount) || 0);
  return "₦" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** ISO date-time -> "7:30 AM" */
export function time(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const h = d.getHours() % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`;
}

/** ISO date-time -> "Tue 12 Nov" */
export function day(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** ISO date-time -> "Oct 2026" */
export function monthYear(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "08035550142" -> "0803 555 0142". Anything that isn't an 11-digit Nigerian number is left as typed. */
export function phone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return raw;
}

/** 1 -> "1 seat left", 0 -> "Full" */
export function seats(n: number): string {
  if (n <= 0) return "Full";
  return `${n} seat${n === 1 ? "" : "s"} left`;
}

/** "Tunde Bakare" -> "TB" */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/** Lagos is UTC+1 all year. Rides are entered and searched in Lagos time. */
const LAGOS_OFFSET_MS = 3_600_000;

/** Today's date in Lagos as YYYY-MM-DD, moved by `addDays`. */
export function lagosDate(addDays = 0): string {
  return new Date(Date.now() + LAGOS_OFFSET_MS + addDays * 86_400_000).toISOString().slice(0, 10);
}

/** "2026-11-20" + "07:30" -> "2026-11-20T07:30:00+01:00" */
export function lagosDateTime(dateValue: string, timeValue: string): string {
  return `${dateValue}T${timeValue}:00+01:00`;
}

/** "2026-11-12" -> "Thu 12 Nov": a calendar day with no time attached. */
export function dayFromDate(dateValue: string): string {
  const [y, m, d] = dateValue.split("-").map(Number);
  if (!y || !m || !d) return "";
  const date = new Date(y, m - 1, d);
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}
