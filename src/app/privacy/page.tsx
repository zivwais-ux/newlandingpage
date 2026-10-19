import type { Metadata } from "next";
import { Fill } from "@/components/Fill";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "מדיניות פרטיות", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <LegalPage title="מדיניות פרטיות">
      <p>
        <Fill value="[למלא – נוסח מדיניות פרטיות: אילו פרטים נאספים בטופס, לאן הם נשלחים ולכמה זמן נשמרים. יש לבדוק מול גורם מוסמך]" />
      </p>
    </LegalPage>
  );
}
