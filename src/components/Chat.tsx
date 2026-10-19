type Props = {
  title: string;
  sub: string;
  ask: string;
  answer: string[];
  asList?: boolean;
};

// קטע ממשק אמיתי: שיחה עם העוזר שבונים בשיעור.
export function Chat({ title, sub, ask, answer, asList = true }: Props) {
  return (
    <div className="chat" data-ui>
      <div className="chat__head">
        <span className="chat__avatar" aria-hidden="true">AI</span>
        <div>
          <div className="chat__title">{title}</div>
          <div className="chat__sub">{sub}</div>
        </div>
      </div>
      <p className="chat__msg chat__msg--me">{ask}</p>
      <div className="chat__msg chat__msg--tool">
        {asList ? (
          <ul>
            {answer.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        ) : (
          answer.map((a) => <p key={a}>{a}</p>)
        )}
      </div>
    </div>
  );
}
