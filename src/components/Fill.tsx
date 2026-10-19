// מציג טקסט רגיל, או תגית צהובה בולטת אם הערך עדיין לא מולא.
export function Fill({ value }: { value: string }) {
  if (!value.startsWith("[")) return <>{value}</>;
  return <mark className="todo">{value}</mark>;
}
