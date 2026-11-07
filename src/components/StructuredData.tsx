import { build, business, faq, nav, plans, seo } from "@/content/site";

// הנתונים המובנים של דף הבית (JSON-LD), כדי שגוגל יבין מי העסק, מה הוא מציע, איפה, ומה השאלות הנפוצות.
// הכול נבנה מתוכן האתר, כך שהוא מתעדכן לבד כשהתוכן משתנה.
export function StructuredData() {
  const url = business.siteUrl;
  const founder = `${business.teacher} ויסמן`;
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url,
      name: nav.wordmark,
      inLanguage: "he-IL",
      publisher: { "@id": `${url}/#business` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${url}/#business`,
      name: nav.wordmark,
      alternateName: business.name,
      description: seo.description,
      url,
      image: `${url}/og.png`,
      telephone: `+${business.whatsappNumber}`,
      email: business.email,
      founder: { "@type": "Person", name: founder, jobTitle: "מפתח AI ומלווה עסקים" },
      address: { "@type": "PostalAddress", addressLocality: "מודיעין", addressCountry: "IL" },
      areaServed: [
        { "@type": "City", name: "מודיעין" },
        { "@type": "AdministrativeArea", name: "אזור המרכז" },
        { "@type": "Country", name: "ישראל" },
      ],
      availableLanguage: "he",
      knowsAbout: seo.keywords,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: plans.title,
        itemListElement: [
          ...plans.items.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: p.name, description: p.text } })),
          ...build.examples.map((e) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: e.system, description: e.gives } })),
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      mainEntity: faq.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }}
    />
  );
}
