import { nav } from "@/content/site";

// הלוגו: "ZIV" מודגש, "solutions" קל, ונקודה מרווה בסוף. אותו לוגו בתפריט ובפוטר (בגודל אחר).
export function Logo({ className = "" }: { className?: string }) {
  const [first, ...rest] = nav.wordmark.split(" ");
  return (
    <span className={`logo ${className}`} dir="ltr">
      <b>{first}</b>
      {rest.length > 0 && <span> {rest.join(" ")}</span>}
      <i className="logo__dot" aria-hidden="true" />
    </span>
  );
}
