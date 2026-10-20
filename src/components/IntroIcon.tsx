import type { IntroIcon as Name } from "@/content/site";

// אייקוני קו קטנים שמשתלבים בתוך שורת הטקסט. אותו עובי קו ואותן פינות לכולם.
const PATHS: Record<Name, string[]> = {
  laptop: ["M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V15H5z", "M2.5 18.5h19", "M10 18.5h4"],
  notebook: ["M7 3.5h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z", "M3.5 8h3M3.5 12h3M3.5 16h3", "M10 8.5h5.5M10 12h5.5M10 15.5h3"],
  coffee: ["M4.5 10h11v4.5a4.5 4.5 0 0 1-4.5 4.5H9a4.5 4.5 0 0 1-4.5-4.5z", "M15.5 11.5h1.25a2.25 2.25 0 0 1 0 4.5H15", "M8 3.5c-.9.9.9 1.8 0 3", "M11.5 3.5c-.9.9.9 1.8 0 3"],
};

export function IntroIcon({ name }: { name: Name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="intro__icon"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
