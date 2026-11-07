import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { accessibility } from "@/content/legal";

export const metadata: Metadata = {
  title: accessibility.title,
  description: accessibility.description,
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return <LegalPage doc={accessibility} />;
}
