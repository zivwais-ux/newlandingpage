// קטעי ממשק אמיתיים, כמו צילומי מסך מהטלפון:
// WhatsAppChat – שיחת וואטסאפ: עם זיו, או בין לקוח למערכת של עסק.

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
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
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

/** מכשיר אייפון מצויר ב-CSS: מסגרת, כפתורי צד, Dynamic Island ופס בית. המסך הוא ה-children. */
export function IPhone({ children }: { children: React.ReactNode }) {
  return (
    <div className="iphone" data-ui>
      <span className="iphone__btn iphone__btn--action" aria-hidden="true" />
      <span className="iphone__btn iphone__btn--up" aria-hidden="true" />
      <span className="iphone__btn iphone__btn--down" aria-hidden="true" />
      <span className="iphone__btn iphone__btn--power" aria-hidden="true" />
      <div className="iphone__screen">
        <span className="iphone__island" aria-hidden="true" />
        {children}
        <span className="iphone__home" aria-hidden="true" />
      </div>
    </div>
  );
}

/** מחשב MacBook מצויר ב-CSS: מכסה עם מסך (macOS בערב, מסמך שנתקע באמצע) ובסיס אלומיניום.
 *  ההתראות הן ה-children (מונחות מעל המסך ב-CSS); כל השאר תפאורה (aria-hidden). */
export function MacBook({ children }: { children: React.ReactNode }) {
  return (
    <div className="laptop" data-ui>
      <div className="laptop__body">
        <div className="laptop__lid">
          <div className="laptop__screen">
            <span className="laptop__notch" aria-hidden="true" />
            <div className="mac__bar" aria-hidden="true">
              <span className="mac__menu">
                <b>קובץ</b>
                <span>עריכה</span>
                <span>הוספה</span>
                <span>עיצוב</span>
              </span>
              <span className="mac__status" dir="ltr">
                <svg viewBox="0 0 16 12" className="mac__wifi">
                  <path d="M8 11.5 5.6 8.9a3.4 3.4 0 0 1 4.8 0L8 11.5zM3.4 6.7a6.6 6.6 0 0 1 9.2 0l-1.4 1.5a4.6 4.6 0 0 0-6.4 0L3.4 6.7zM1 4.3a10 10 0 0 1 14 0l-1.4 1.5a8 8 0 0 0-11.2 0L1 4.3z" />
                </svg>
                <span className="mac__battery">
                  <i />
                </span>
                <span>18%</span>
                <span dir="rtl">יום ב׳ 23:04</span>
              </span>
            </div>
            <div className="mac__doc" aria-hidden="true">
              <div className="mac__doc-bar">
                <span className="mac__lights">
                  <i />
                  <i />
                  <i />
                </span>
                <span>הצעת מחיר – טיוטה</span>
              </div>
              <div className="mac__doc-page">
                <p>שלום רב,</p>
                <p>
                  בהמשך לשיחתנו, מצורפת
                  <span className="mac__caret" />
                </p>
              </div>
            </div>
            <div className="mac__dock" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <div className="laptop__base" aria-hidden="true" />
      </div>
      {/* ההתראות: על המסך במחשב; בטלפון "קופצות" ממנו (באותו תא, מעל המכשיר) */}
      {children}
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

type WhatsAppLine = { from: "client" | "bot"; text: string };

type WhatsAppProps = {
  name: string;
  /** שיחה קצרה: הודעה אחת ותשובה */
  sent?: string;
  reply?: string;
  /** שיחה מלאה בין לקוח (הודעות יוצאות) לבין המערכת של העסק (נכנסות) */
  messages?: WhatsAppLine[];
  /** השורה שמתחת לשם, למשל "מענה אוטומטי" */
  status?: string;
  /** רק תוכן המסך, בלי כרטיס משלו: כשהשיחה מוצגת בתוך מכשיר (IPhone) */
  bare?: boolean;
};

/** שעה לכל הודעה, דקה אחרי הקודמת */
const stamp = (i: number) => `10:${String(42 + i).padStart(2, "0")}`; // taste-skill-ignore: a clock time

export function WhatsAppChat({ name, sent = "", reply = "", messages, status = "מחובר/ת", bare = false }: WhatsAppProps) {
  const lines: WhatsAppLine[] = messages ?? [
    { from: "client", text: sent },
    { from: "bot", text: reply },
  ];
  const said = lines.map((m) => `${m.from === "client" ? "לקוח" : name}: ${m.text}`).join(" · ");
  return (
    <div className={`phone phone--wa ${bare ? "phone--bare" : ""}`} data-ui role="img" aria-label={`דוגמה לשיחת וואטסאפ עם ${name}. ${said}`}>
      {bare && <StatusBar time="10:45" />}
      <div className="wa__bar" aria-hidden="true">
        <Glyph d={ICON.back} className="ui-icon ui-icon--sm" />
        <span className="wa__avatar">{name[0]}</span>
        <span className="wa__who">
          <b>{name}</b>
          <span>{status}</span>
        </span>
        <span className="wa__calls">
          <Glyph d={ICON.video} className="ui-icon ui-icon--sm" />
          <Glyph d={ICON.phone} className="ui-icon ui-icon--sm" />
        </span>
      </div>
      <div className="wa__body" aria-hidden="true">
        <span className="wa__day">היום</span>
        {lines.map((m, i) => (
          <p
            key={i}
            className={`wa__msg ${m.from === "client" ? "wa__msg--out" : "wa__msg--in"}`}
            style={{ "--n": i } as React.CSSProperties}
          >
            {m.text}
            <span className="wa__meta">
              {stamp(i * 2)}
              {m.from === "client" && <ReadTicks />}
            </span>
          </p>
        ))}
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

/** הודעת הוואטסאפ שהגולש ישלח, כבועה יוצאת שצפה על פינת התמונה בהירו (קישוט בלבד) */
export function HeroBubble({ text }: { text: string }) {
  return (
    <div className="hero__bubble" data-ui aria-hidden="true">
      <p className="wa__msg wa__msg--out">
        {text}
        <span className="wa__meta">
          10:42
          <ReadTicks />
        </span>
      </p>
    </div>
  );
}

// ---------- system screens for "What we build": each business sees a different system at work ----------
// Every item carries --n, its turn: on each choice the items arrive one after another, as if the
// system is working right now. A status that changes shows both labels; CSS crossfades them in turn.

type Screen =
  | { kind: "crm"; title: string; leads: { name: string; need: string; source: string; status: string; next?: string }[]; task: string }
  | { kind: "payroll"; title: string; rows: { name: string; hours: string; pay: string }[]; total: string; done: string }
  | { kind: "inbox"; title: string; mails: { from: string; subject: string; amount: string }[]; alert: { app: string; text: string } }
  | { kind: "calendar"; day: string; appts: { time: string; name: string; status: "confirmed" | "waitlist" }[]; note: string };

const turn = (n: number) => ({ "--n": n }) as React.CSSProperties;

/** a status label that changes from one value to the next at its turn */
function StatusSwap({ from, to, n, tone }: { from: string; to: string; n: number; tone: string }) {
  return (
    <span className="chip-swap" style={turn(n)}>
      <span className="chip chip--wait chip-from">{from}</span>
      <span className={`chip chip--${tone} chip-to`}>{to}</span>
    </span>
  );
}

function AppShell({ kind, title, label, children }: { kind: string; title: string; label: string; children: React.ReactNode }) {
  return (
    <div className={`phone phone--bare app app--${kind}`} data-ui role="img" aria-label={label}>
      <StatusBar time="10:45" />
      <div className="app__bar" aria-hidden="true">
        <Glyph d={ICON.back} className="ui-icon ui-icon--sm" />
        <b>{title}</b>
      </div>
      <div className="app__body" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

export function SystemScreen({ screen }: { screen: Screen }) {
  if (screen.kind === "crm") {
    // the newest lead sits on top but arrives last, after the ones already in the list
    const [fresh, ...rest] = screen.leads;
    const label = `דוגמה למערכת CRM: ${screen.leads.map((l) => `${l.name}, ${l.need}, ${l.next ?? l.status}`).join(" · ")}. ${screen.task}`;
    return (
      <AppShell kind="crm" title={screen.title} label={label}>
        {[fresh, ...rest].map((l, i) => {
          const n = i === 0 ? rest.length : i - 1;
          return (
            <div key={l.name} className="crm__lead sys-in" style={turn(n)}>
              <span className="crm__top">
                <b>{l.name}</b>
                <span className="crm__source">{l.source}</span>
              </span>
              <span className="crm__need">{l.need}</span>
              {l.next ? (
                <StatusSwap from={l.status} to={l.next} n={n + 1} tone="done" />
              ) : (
                <span className={`chip ${l.status === "נסגר" ? "chip--done" : "chip--open"}`}>{l.status}</span>
              )}
            </div>
          );
        })}
        <p className="crm__task sys-in" style={turn(rest.length + 2)}>
          <span className="app__dot" />
          {screen.task}
        </p>
      </AppShell>
    );
  }

  if (screen.kind === "payroll") {
    const label = `דוגמה למערכת חישוב שכר: ${screen.rows.map((r) => `${r.name} ${r.hours}, ${r.pay}`).join(" · ")}. סה״כ ${screen.total}, ${screen.done}`;
    return (
      <AppShell kind="payroll" title={screen.title} label={label}>
        <div className="pay__head">
          <span>עובד</span>
          <span>שעות מהשעון</span>
          <span>שכר</span>
        </div>
        {screen.rows.map((r, i) => (
          <div key={r.name} className="pay__row sys-in" style={turn(i)}>
            <b>{r.name}</b>
            <span>{r.hours}</span>
            <span className="pay__sum">{r.pay}</span>
          </div>
        ))}
        <div className="pay__total sys-in" style={turn(screen.rows.length)}>
          <b>סה״כ לתשלום</b>
          <span className="pay__sum">{screen.total}</span>
        </div>
        <span className="chip chip--done pay__done sys-in" style={turn(screen.rows.length + 1)}>
          {screen.done}
        </span>
      </AppShell>
    );
  }

  if (screen.kind === "inbox") {
    const label = `דוגמה לסוכן חשבוניות במייל: ${screen.mails.map((m) => `${m.from}, ${m.subject}, ${m.amount}`).join(" · ")}. ${screen.alert.app}: ${screen.alert.text}`;
    return (
      <AppShell kind="inbox" title={screen.title} label={label}>
        {screen.mails.map((m, i) => (
          <div key={m.subject} className="mail sys-in" style={turn(i)}>
            <span className="mail__avatar">{m.from[0]}</span>
            <span className="mail__text">
              <b>{m.from}</b>
              <span>{m.subject}</span>
            </span>
            <span className="mail__amount">{m.amount}</span>
          </div>
        ))}
        <div className="mail__alert sys-drop" style={turn(screen.mails.length)}>
          <b>{screen.alert.app}</b>
          <span>{screen.alert.text}</span>
        </div>
      </AppShell>
    );
  }

  const label = `דוגמה ליומן שמאשר לבד, ${screen.day}: ${screen.appts.map((a) => `${a.time} ${a.name}`).join(" · ")}. ${screen.note}`;
  return (
    <AppShell kind="calendar" title={screen.day} label={label}>
      {screen.appts.map((a, i) => (
        <div key={a.time} className={`cal__slot sys-in ${a.status === "waitlist" ? "cal__slot--wait" : ""}`} style={turn(i)}>
          <span className="cal__time">{a.time}</span>
          <span className="cal__event">
            <b>{a.name}</b>
            {a.status === "confirmed" ? (
              <StatusSwap from="ממתין לאישור" to="אישר/ה" n={i + 1} tone="done" />
            ) : (
              <span className="chip chip--open">הוצע מרשימת ההמתנה</span>
            )}
          </span>
        </div>
      ))}
      <p className="cal__note sys-in" style={turn(screen.appts.length + 1)}>
        <span className="app__dot" />
        {screen.note}
      </p>
    </AppShell>
  );
}
