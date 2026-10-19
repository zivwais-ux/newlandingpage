import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import Script from "next/script";
import { analytics, business, seo } from "@/content/site";
import "./globals.css";

const heebo = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-heebo", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.title,
    description: seo.description,
    locale: "he_IL",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: seo.title }],
  },
};

export const viewport: Viewport = { themeColor: "#fffaf3" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          דילוג לתוכן
        </a>
        {children}
        {analytics.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${analytics.gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${analytics.gaId}');`}
            </Script>
          </>
        )}
        {analytics.metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${analytics.metaPixelId}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
