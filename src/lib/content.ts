import * as content from "@/content/site";
import { contentSchema } from "./schema";

/** מאמת את כל התוכן של הדף. נקרא בזמן הבנייה; תוכן שבור מכשיל את ה-build עם הודעה ברורה. */
export function validateContent() {
  const result = contentSchema.safeParse(content);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`התוכן ב-src/content/site.ts לא תקין:\n${issues}`);
  }
  return result.data;
}
