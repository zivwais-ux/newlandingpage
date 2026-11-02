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
  /** מצב מערכת: תווית "בוט", נקודות הקלדה לפני כל תשובה של הבוט, והודעת מערכת בסוף */
  bot?: boolean;
  note?: string;
};

/** שעה לכל הודעה, דקה אחרי הקודמת */
const stamp = (i: number) => `10:${String(42 + i).padStart(2, "0")}`; // taste-skill-ignore: a clock time

export function WhatsAppChat({ name, sent = "", reply = "", messages, status = "מחובר/ת", bare = false, bot = false, note }: WhatsAppProps) {
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
          <b>
            {name}
            {bot && <span className="wa__bot">בוט</span>}
          </b>
          <span>{status}</span>
        </span>
        <span className="wa__calls">
          <Glyph d={ICON.video} className="ui-icon ui-icon--sm" />
          <Glyph d={ICON.phone} className="ui-icon ui-icon--sm" />
        </span>
      </div>
      <div className="wa__body" aria-hidden="true">
        <span className="wa__day">היום</span>
        {lines.map((m, i) => {
          const msg = (
            <p key={i} className={`wa__msg ${m.from === "client" ? "wa__msg--out" : "wa__msg--in"}`} style={{ "--n": i } as React.CSSProperties}>
              {m.text}
              <span className="wa__meta">
                {stamp(i * 2)}
                {m.from === "client" && <ReadTicks />}
              </span>
            </p>
          );
          if (!(bot && m.from === "bot")) return msg;
          // the bot "types" first: a small bubble of three dots, then the reply opens in its place
          return (
            <div key={i} className="wa__slot" style={{ "--n": i } as React.CSSProperties}>
              <span className="wa__dots">
                <i />
                <i />
                <i />
              </span>
              {msg}
            </div>
          );
        })}
        {note && (
          <span className="wa__note sys-in" style={{ "--n": lines.length } as React.CSSProperties}>
            <Glyph d="M5 12.5l4.5 4.5L19 7.5" className="wa__note-icon" />
            {note}
          </span>
        )}
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
// Each screen is a small app: a large title, a bar where the AI shows what it is doing and then what it
// has done, the app's own content and a tab bar. Every item carries --n, its turn: on each choice the
// items arrive one after another, statuses change and bars fill, as if the system is working right now.

type Ai = { working: string; done: string };
type Screen =
  | {
      kind: "crm";
      title: string;
      sub: string;
      ai: Ai;
      kpis: { label: string; value: string }[];
      leads: { name: string; need: string; source: "site" | "whatsapp" | "facebook"; status: string; next?: string }[];
      task: string;
    }
  | { kind: "payroll"; title: string; sub: string; ai: Ai; rows: { name: string; hours: number; pay: string }[]; total: string; done: string }
  | { kind: "inbox"; title: string; ai: Ai; mails: { from: string; subject: string; amount: string }[]; alert: { app: string; text: string; action: string } }
  | { kind: "calendar"; title: string; day: string; ai: Ai; appts: { time: string; name: string; status: "confirmed" | "waitlist" }[]; note: string };

const APP_ICON = {
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  calendar: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4",
  bell: "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  folder: "M3 6h6l2 2h10v11H3z",
  wallet: "M3 7h18v12H3zM3 7l3-3h12l3 3M16 13h2",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  site: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  whatsapp: "M5 19l1.3-3.6A8 8 0 1 1 9 18.6z",
  facebook: "M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
};

const turn = (n: number) => ({ "--n": n }) as React.CSSProperties;

/** the same name always gets the same tint: green, teal, sand or grey */
function Avatar({ name }: { name: string }) {
  const tone = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 4;
  return (
    <span className={`ava ava--${tone}`} aria-hidden="true">
      {name.replace(/^רשימת המתנה: /, "")[0]}
    </span>
  );
}

/** a status label that changes from one value to the next at its turn */
function StatusSwap({ from, to, n, tone }: { from: string; to: string; n: number; tone: string }) {
  return (
    <span className="chip-swap" style={turn(n)}>
      <span className="chip chip--wait chip-from">{from}</span>
      <span className={`chip chip--${tone} chip-to`}>{to}</span>
    </span>
  );
}

/** the AI at work: a pulsing dot and what it is doing, which turns into what it has done */
function AiBar({ ai, n }: { ai: Ai; n: number }) {
  return (
    <div className="ai-bar">
      <span className="chip-swap" style={turn(n)}>
        <span className="ai-bar__now chip-from">
          <span className="ai-bar__pulse" />
          {ai.working}
        </span>
        <span className="ai-bar__done chip-to">
          <Glyph d={APP_ICON.check} className="ai-bar__icon" />
          {ai.done}
        </span>
      </span>
    </div>
  );
}

function TabBar({ tabs, active }: { tabs: (keyof typeof APP_ICON)[]; active: number }) {
  return (
    <div className="tabbar">
      {tabs.map((t, i) => (
        <span key={t} className={i === active ? "tabbar__on" : undefined}>
          <Glyph d={APP_ICON[t]} className="tabbar__icon" />
        </span>
      ))}
    </div>
  );
}

function AppShell({
  kind,
  title,
  sub,
  ai,
  last,
  tabs,
  label,
  children,
}: {
  kind: string;
  title: string;
  sub?: string;
  ai: Ai;
  /** the turn of the screen's last item: the AI is done right after it */
  last: number;
  tabs: (keyof typeof APP_ICON)[];
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`phone phone--bare app app--${kind}`} data-ui role="img" aria-label={label}>
      <StatusBar time="10:45" />
      <div className="app__main" aria-hidden="true">
        <div className="app__head">
          <b className="app__title">{title}</b>
          {sub && <span className="app__sub">{sub}</span>}
        </div>
        <AiBar ai={ai} n={last + 1} />
        <div className="app__body">{children}</div>
      </div>
      <TabBar tabs={tabs} active={0} />
    </div>
  );
}

export function SystemScreen({ screen }: { screen: Screen }) {
  if (screen.kind === "crm") {
    // the newest lead sits on top but arrives last, after the ones already in the list
    const [fresh, ...rest] = screen.leads;
    const last = rest.length + 2;
    const label = `דוגמה למערכת CRM: ${screen.leads.map((l) => `${l.name}, ${l.need}, ${l.next ?? l.status}`).join(" · ")}. ${screen.task}`;
    return (
      <AppShell kind="crm" title={screen.title} sub={screen.sub} ai={screen.ai} last={last} tabs={["list", "calendar", "bell", "user"]} label={label}>
        <div className="kpis">
          {screen.kpis.map((k) => (
            <span key={k.label} className="kpi">
              <b>{k.value}</b>
              {k.label}
            </span>
          ))}
        </div>
        <div className="seg">
          <span className="seg__on">הכול</span>
          <span>חדשים</span>
          <span>בטיפול</span>
        </div>
        {[fresh, ...rest].map((l, i) => {
          const n = i === 0 ? rest.length : i - 1;
          return (
            <div key={l.name} className={`lead sys-in ${i === 0 ? "lead--new" : ""}`} style={turn(n)}>
              <Avatar name={l.name} />
              <span className="lead__text">
                <b>{l.name}</b>
                <span>{l.need}</span>
              </span>
              <span className="lead__side">
                <Glyph d={APP_ICON[l.source]} className="lead__source" />
                {l.next ? (
                  <StatusSwap from={l.status} to={l.next} n={n + 1} tone="done" />
                ) : (
                  <span className={`chip ${l.status === "נסגר" ? "chip--done" : "chip--open"}`}>{l.status}</span>
                )}
              </span>
            </div>
          );
        })}
        <p className="task sys-in" style={turn(last)}>
          <Glyph d={APP_ICON.bell} className="task__icon" />
          {screen.task}
        </p>
      </AppShell>
    );
  }

  if (screen.kind === "payroll") {
    const last = screen.rows.length + 1;
    const label = `דוגמה למערכת חישוב שכר: ${screen.rows.map((r) => `${r.name} ${r.hours} שעות, ${r.pay}`).join(" · ")}. סה״כ ${screen.total}, ${screen.done}`;
    return (
      <AppShell kind="payroll" title={screen.title} sub={screen.sub} ai={screen.ai} last={last} tabs={["home", "wallet", "chart", "user"]} label={label}>
        <div className="pay-card sys-in" style={turn(0)}>
          <span className="pay-card__label">סה״כ לתשלום</span>
          <b className="pay-card__sum">{screen.total}</b>
          <span className="pay-card__meter">
            <span className="pay-card__fill" style={turn(0)} />
          </span>
          <span className="pay-card__label">
            חושב {screen.rows.length}/{screen.rows.length} עובדים
          </span>
        </div>
        {screen.rows.map((r, i) => (
          <div key={r.name} className="pay-row sys-in" style={turn(i + 1)}>
            <Avatar name={r.name} />
            <span className="pay-row__text">
              <b>{r.name}</b>
              <span className="pay-row__hours">
                <span className="hours-bar">
                  <span style={{ transform: `scaleX(${(r.hours / 186).toFixed(3)})` }} />
                </span>
                {r.hours} שעות
              </span>
            </span>
            <span className="pay-row__sum">{r.pay}</span>
          </div>
        ))}
        <span className="chip chip--done pay-done sys-in" style={turn(last)}>
          <Glyph d={APP_ICON.check} className="chip__icon" />
          {screen.done}
        </span>
      </AppShell>
    );
  }

  if (screen.kind === "inbox") {
    const last = screen.mails.length;
    const label = `דוגמה לסוכן חשבוניות במייל: ${screen.mails.map((m) => `${m.from}, ${m.subject}, ${m.amount}`).join(" · ")}. ${screen.alert.app}: ${screen.alert.text}`;
    return (
      <AppShell kind="inbox" title={screen.title} ai={screen.ai} last={last} tabs={["mail", "search", "folder", "user"]} label={label}>
        <span className="search">
          <Glyph d={APP_ICON.search} className="search__icon" />
          חיפוש
        </span>
        {screen.mails.map((m, i) => (
          <div key={m.subject} className="mail sys-in" style={turn(i)}>
            <Avatar name={m.from} />
            <span className="mail__text">
              <b>{m.from}</b>
              <span>{m.subject}</span>
            </span>
            <span className="mail__side">
              <span className="mail__amount">{m.amount}</span>
              <span className="chip chip--done">חשבונית</span>
            </span>
          </div>
        ))}
        <div className="agent sys-drop" style={turn(last)}>
          <span className="agent__head">
            <span className="ai-bar__pulse ai-bar__pulse--still" />
            <b>{screen.alert.app}</b>
          </span>
          <span>{screen.alert.text}</span>
          <span className="agent__action">
            <Glyph d={APP_ICON.folder} className="chip__icon" />
            {screen.alert.action}
          </span>
        </div>
      </AppShell>
    );
  }

  const last = screen.appts.length + 1;
  const week = ["א", "ב", "ג", "ד", "ה", "ו"];
  const label = `דוגמה ליומן שמאשר לבד, ${screen.day}: ${screen.appts.map((a) => `${a.time} ${a.name}`).join(" · ")}. ${screen.note}`;
  return (
    <AppShell kind="calendar" title={screen.title} sub={screen.day} ai={screen.ai} last={last} tabs={["calendar", "list", "bell", "user"]} label={label}>
      <div className="week">
        {week.map((d, i) => (
          <span key={d} className={i === 2 ? "week__on" : undefined}>
            <small>{d}</small>
            {10 + i}
          </span>
        ))}
      </div>
      {screen.appts.map((a, i) => (
        <div key={a.time} className={`slot sys-in ${a.status === "waitlist" ? "slot--wait" : ""}`} style={turn(i)}>
          <span className="slot__time">{a.time}</span>
          <span className="slot__event">
            <Avatar name={a.name} />
            <b>{a.name}</b>
            {a.status === "confirmed" ? (
              <StatusSwap from="ממתין" to="אישר/ה" n={i + 1} tone="done" />
            ) : (
              <span className="chip chip--open">הוצע</span>
            )}
          </span>
        </div>
      ))}
      <p className="task sys-in" style={turn(last)}>
        <Glyph d={APP_ICON.clock} className="task__icon" />
        {screen.note}
      </p>
    </AppShell>
  );
}
