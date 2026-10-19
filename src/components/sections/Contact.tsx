"use client";

import { contact } from "@/content/site";
import { trackWhatsAppClick, whatsappLink } from "@/lib/whatsapp";
import { LeadForm } from "../LeadForm";

export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="coupon" data-reveal style={{ "--cut": "38%" } as React.CSSProperties}>
          <span className="coupon__notch notch-top" aria-hidden="true" />
          <span className="coupon__notch notch-bottom" aria-hidden="true" />
          <span className="coupon__notch notch-start" aria-hidden="true" />
          <span className="coupon__notch notch-end" aria-hidden="true" />
          <div className="coupon__a">
            <h2 id="contact-title">{contact.title}</h2>
            <p className="coupon__text">
              {contact.text}{" "}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
                onClick={() => trackWhatsAppClick("contact")}
              >
                {contact.whatsappLink}
              </a>
            </p>
          </div>
          <div className="coupon__b">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
