import { business, whatsappMessage } from "@/content/site";

export function whatsappLink(text: string = whatsappMessage): string {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(text)}`;
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
