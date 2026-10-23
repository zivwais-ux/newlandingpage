import Image from "next/image";
import { business, how, primaryAction, whatsappMessage } from "@/content/site";
import { WhatsAppButton } from "../WhatsAppButton";
import { WhatsAppChat } from "../Chat";

// שלושה כרטיסים שנערמים בגלילה: כל שלב נצמד למעלה, והבא מחליק מעליו (CSS בלבד).
export function How() {
  const [talk, lesson, after] = how.steps;
  return (
    <section id="how" className="how wrap" aria-labelledby="how-title">
      <h2 id="how-title" className="how__head" data-reveal>
        {how.title}
      </h2>
      <ol className="how__deck">
        <li className="how__card how__card--1" style={{ "--i": 0 } as React.CSSProperties}>
          <div className="how__media">
            <WhatsAppChat
              name={business.teacher}
              sent={whatsappMessage}
              reply="בשמחה! ספרו לי במשפט מה העסק ומה לוקח לכם הכי הרבה זמן."
            />
          </div>
          <div className="how__body">
            <span className="how__num">שלב 1</span>
            <h3>{talk.name}</h3>
            <p>{talk.text}</p>
          </div>
        </li>
        <li className="how__card how__card--2" style={{ "--i": 1 } as React.CSSProperties}>
          <div className="how__media">
            <div className="how__pic">
              <Image src={lesson.img!} alt={lesson.alt!} width={640} height={480} loading="lazy" />
            </div>
          </div>
          <div className="how__body">
            <span className="how__num">שלב 2</span>
            <h3>{lesson.name}</h3>
            <p>{lesson.text}</p>
          </div>
        </li>
        <li className="how__card how__card--3" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="how__media">
            <div className="how__pic">
              <Image src={after.img!} alt={after.alt!} width={640} height={427} loading="lazy" />
            </div>
          </div>
          <div className="how__body">
            <span className="how__num">שלב 3</span>
            <h3>{after.name}</h3>
            <p>{after.text}</p>
          </div>
        </li>
      </ol>
      <div className="how__cta">
        <WhatsAppButton label={primaryAction} location="how" />
      </div>
    </section>
  );
}
