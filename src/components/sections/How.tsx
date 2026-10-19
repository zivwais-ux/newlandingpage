import Image from "next/image";
import { how, primaryAction, whatsappMessage } from "@/content/site";
import { WhatsAppButton } from "../WhatsAppButton";
import { Chat } from "../Chat";

export function How() {
  const [talk, lesson, after] = how.steps;
  return (
    <section id="how" className="how wrap" aria-labelledby="how-title">
      <div className="how__grid">
        <h2 id="how-title" className="how__head" data-reveal>
          {how.title}
        </h2>
        <ol className="how__steps">
        <li className="how__step how__step--1" data-reveal>
          <div className="how__tile how__tile--1">
            <Chat title="וואטסאפ" sub="שיחת ייעוץ" ask={whatsappMessage} answer={["בשמחה! ספרו לי במשפט מה העסק ומה לוקח לכם הכי הרבה זמן."]} asList={false} />
          </div>
          <h3>{talk.name}</h3>
          <p>{talk.text}</p>
        </li>
        <li className="how__step how__step--2" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          <div className="how__tile how__tile--2">
            <div className="how__pic">
              <Image src={lesson.img!} alt={lesson.alt!} width={640} height={480} loading="lazy" />
            </div>
          </div>
          <h3>{lesson.name}</h3>
          <p>{lesson.text}</p>
        </li>
        <li className="how__step how__step--3" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
          <div className="how__tile how__tile--3">
            <div className="how__pic">
              <Image src={after.img!} alt={after.alt!} width={640} height={427} loading="lazy" />
            </div>
          </div>
          <h3>{after.name}</h3>
          <p>{after.text}</p>
        </li>
        </ol>
      </div>
      <div className="how__cta" data-reveal>
        <WhatsAppButton label={primaryAction} location="how" />
      </div>
    </section>
  );
}
