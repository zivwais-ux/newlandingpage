import type { Metadata } from "next";
import { Fill } from "@/components/Fill";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "הצהרת נגישות", robots: { index: false } };

export default function AccessibilityPage() {
  return (
    <LegalPage title="הצהרת נגישות">
      <p>
        <Fill value="[למלא – נוסח הצהרת נגישות. יש לבדוק מול גורם מוסמך לפני פרסום]" />
      </p>
      <p>
        <Fill value="[למלא – פרטי רכז/ת נגישות ודרכי פנייה]" />
      </p>
    </LegalPage>
  );
}
