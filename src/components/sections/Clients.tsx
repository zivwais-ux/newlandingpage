import Image from "next/image";
import { clients } from "@/content/site";

// "עסקים שעבדתי איתם": פס שנע לאט מתחת להירו. כל כרטיס: הלוגו (או האות הראשונה), שם העסק, ומה נבנה בשבילו;
// ציטוט מופיע רק כשיש ציטוט אמיתי בתוכן. העותק השני רק משלים את הלולאה ומוסתר מקוראי מסך.
function Cards({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="clients__list" aria-hidden={hidden || undefined}>
      {clients.items.map((c) => (
        <li key={c.name} className="client">
          {c.logo ? (
            <Image src={c.logo} alt={hidden ? "" : `הלוגו של ${c.name}`} width={240} height={240} className="client__mark client__mark--logo" />
          ) : (
            <span className="client__mark" aria-hidden="true">
              {c.name[0]}
            </span>
          )}
          <span className="client__text">
            <b>{c.name}</b>
            {c.quote ? <q>{c.quote}</q> : <span>{c.built}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Clients() {
  return (
    <section className="clients" aria-labelledby="clients-title">
      <h2 id="clients-title" className="clients__title">
        {clients.title}
      </h2>
      <div className="clients__view">
        <div className="clients__track">
          <Cards />
          <Cards hidden />
        </div>
      </div>
    </section>
  );
}
