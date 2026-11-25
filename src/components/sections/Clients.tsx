import Image from "next/image";
import { clients } from "@/content/site";

// "הוכחות מהשטח": פס שנע לאט מתחת להירו. כל כרטיס: ההמלצה, התוצאה בשטח, ובתחתית הלוגו (או האות הראשונה) ושם העסק;
// ההמלצה מופיעה במקום התיאור כשיש המלצה מאושרת בתוכן. העותק השני רק משלים את הלולאה ומוסתר מקוראי מסך.
function Cards({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="clients__list" aria-hidden={hidden || undefined}>
      {clients.items.map((c) => (
        <li key={c.name} className="client">
          {c.quote ? <q className="client__quote">{c.quote}</q> : <p className="client__quote">{c.built}</p>}
          <p className="client__result">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8.5 6.5 12 13 4.5" />
            </svg>
            {c.result}
          </p>
          <div className="client__who">
            {c.logo ? (
              <Image src={c.logo} alt={hidden ? "" : `הלוגו של ${c.name}`} width={240} height={240} className="client__mark client__mark--logo" />
            ) : (
              <span className="client__mark" aria-hidden="true">
                {c.name[0]}
              </span>
            )}
            <b>{c.name}</b>
          </div>
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
