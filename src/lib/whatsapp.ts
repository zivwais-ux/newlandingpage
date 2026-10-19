import { business, whatsappMessage } from "@/content/site";
import { whatsappMessageSchema, whatsappNumberSchema } from "./schema";

/** בונה קישור wa.me עם הודעה מוכנה. זורק שגיאה אם המספר או ההודעה לא תקינים. */
export function whatsappLink(text: string = whatsappMessage, number: string = business.whatsappNumber): string {
  const n = whatsappNumberSchema.parse(number);
  const url = new URL(`https://wa.me/${n}`);
  url.searchParams.set("text", text);
  return url.toString();
}

/** קישור עם הודעה מוכנה שנבדקה מראש (מתחילה ב"היי זיו" ולא ארוכה מדי). */
export function presetWhatsappLink(text: string): string {
  return whatsappLink(whatsappMessageSchema.parse(text));
}

type TrackWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

export function trackWhatsAppClick(location: string): void {
  const w = window as TrackWindow;
  w.gtag?.("event", "whatsapp_click", { location });
  w.fbq?.("track", "Contact", { location });
}
