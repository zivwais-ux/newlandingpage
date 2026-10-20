// שני קטעי ממשק אמיתיים, כמו צילומי מסך מהטלפון:
// AssistantChat – אפליקציית עוזר AI (בלי לוגו או שם של מוצר אמיתי).
// WhatsAppChat – שיחת וואטסאפ עם זיו.

type IconProps = { d: string; className?: string; fill?: boolean };

function Glyph({ d, className = "ui-icon", fill = false }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const ICON = {
  menu: "M4 7h16M4 12h10M4 17h16",
  edit: "M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4",
  chevron: "M7 10l5 5 5-5",
  copy: "M9 9h10v10H9zM5 15V5h10",
  like: "M7 10v10H4V10h3zm0 0 4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7",
  dislike: "M17 14V4h3v10h-3zm0 0-4 7a2 2 0 0 1-2-2v-4H6a2 2 0 0 1-2-2.3l1.2-6A2 2 0 0 1 7.2 4H17",
  retry: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5",
  plus: "M12 5v14M5 12h14",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
  send: "M12 19V5M5 12l7-7 7 7",
  back: "M9 6l6 6-6 6",
  video: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  smile: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01",
  clip: "M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7",
};

/** שורת הסטטוס של הטלפון: שעה, קליטה, וויי-פיי וסוללה */
function StatusBar({ time }: { time: string }) {
  return (
    <div className="phone__status" dir="ltr" aria-hidden="true">
      <span>{time}</span>
      <span className="phone__sys">
        <svg viewBox="0 0 18 12" className="phone__signal">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" className="phone__wifi">
          <path d="M8 11.5 5.6 8.9a3.4 3.4 0 0 1 4.8 0L8 11.5zM3.4 6.7a6.6 6.6 0 0 1 9.2 0l-1.4 1.5a4.6 4.6 0 0 0-6.4 0L3.4 6.7zM1 4.3a10 10 0 0 1 14 0l-1.4 1.5a8 8 0 0 0-11.2 0L1 4.3z" />
        </svg>
        <svg viewBox="0 0 27 12" className="phone__battery">
          <rect x="0.5" y="0.5" width="23" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="1.6" />
          <rect x="24.8" y="4" width="1.7" height="4" rx="0.8" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

type AssistantProps = {
  ask: string;
  intro: string;
  tool: string;
  answer: string[];
  asList?: boolean;
};

export function AssistantChat({ ask, intro, tool, answer, asList = true }: AssistantProps) {
  return (
    <div className="phone phone--ai" data-ui role="img" aria-label={`דוגמה לשיחה עם עוזר AI: ${ask}`}>
      <StatusBar time="9:41" />
      <div className="ai__bar" aria-hidden="true">
        <Glyph d={ICON.menu} />
        <span className="ai__model">
          עוזר AI
          <Glyph d={ICON.chevron} className="ui-icon ui-icon--sm" />
        </span>
        <Glyph d={ICON.edit} />
      </div>
      <div className="ai__body" aria-hidden="true">
        <p className="ai__user">{ask}</p>
        <div className="ai__answer">
          <p>{intro}</p>
          <p className="ai__tool">{tool}</p>
          {asList ? (
            <ul>
              {answer.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          ) : (
            <div className="ai__quote">
              {answer.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
          )}
          <div className="ai__actions">
            <Glyph d={ICON.copy} className="ui-icon ui-icon--sm" />
            <Glyph d={ICON.like} className="ui-icon ui-icon--sm" />
            <Glyph d={ICON.dislike} className="ui-icon ui-icon--sm" />
            <Glyph d={ICON.retry} className="ui-icon ui-icon--sm" />
          </div>
        </div>
      </div>
      <div className="ai__composer" aria-hidden="true">
        <span className="ai__field">
          <Glyph d={ICON.plus} className="ui-icon ui-icon--sm" />
          <span className="ai__placeholder">שאלו כל דבר</span>
          <Glyph d={ICON.mic} className="ui-icon ui-icon--sm" />
        </span>
        <span className="ai__send">
          <Glyph d={ICON.send} className="ui-icon ui-icon--sm" />
        </span>
      </div>
    </div>
  );
}

/** שני וי כחולים: ההודעה נקראה */
function ReadTicks() {
  return (
    <svg viewBox="0 0 18 11" className="wa__ticks" aria-label="נקרא">
      <path d="M1 6l3 3.5L11 1M7 8.5l1 1L15.5 1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type WhatsAppProps = {
  name: string;
  sent: string;
  reply: string;
};

export function WhatsAppChat({ name, sent, reply }: WhatsAppProps) {
  return (
    <div className="phone phone--wa" data-ui role="img" aria-label={`דוגמה לשיחת וואטסאפ עם ${name}: ${sent}`}>
      <div className="wa__bar" aria-hidden="true">
        <Glyph d={ICON.back} className="ui-icon ui-icon--sm" />
        <span className="wa__avatar">{name[0]}</span>
        <span className="wa__who">
          <b>{name}</b>
          <span>מחובר/ת</span>
        </span>
        <span className="wa__calls">
          <Glyph d={ICON.video} className="ui-icon ui-icon--sm" />
          <Glyph d={ICON.phone} className="ui-icon ui-icon--sm" />
        </span>
      </div>
      <div className="wa__body" aria-hidden="true">
        <span className="wa__day">היום</span>
        <p className="wa__msg wa__msg--out">
          {sent}
          <span className="wa__meta">
            10:42
            <ReadTicks />
          </span>
        </p>
        <p className="wa__msg wa__msg--in">
          {reply}
          <span className="wa__meta">10:44</span>
        </p>
      </div>
      <div className="wa__composer" aria-hidden="true">
        <span className="wa__field">
          <Glyph d={ICON.smile} className="ui-icon ui-icon--sm" />
          <span>הודעה</span>
          <Glyph d={ICON.clip} className="ui-icon ui-icon--sm" />
        </span>
        <span className="wa__mic">
          <Glyph d={ICON.mic} className="ui-icon ui-icon--sm" />
        </span>
      </div>
    </div>
  );
}
