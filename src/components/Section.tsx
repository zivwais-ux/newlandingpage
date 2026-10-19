import type { ReactNode } from "react";

type Props = {
  id?: string;
  title: string;
  subtitle?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Section({ id, title, subtitle, className = "", children }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`px-4 py-16 sm:px-6 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id={headingId} className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-4 text-lg text-muted sm:text-xl">{subtitle}</p>}
        </div>
        <div className="mt-10 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
