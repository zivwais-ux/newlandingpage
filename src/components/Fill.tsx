import { TODO_PREFIX } from "@/content/site";

// מציג טקסט רגיל, או תגית צהובה בולטת אם הערך עדיין לא מולא.
export function Fill({ value }: { value: string }) {
  if (!value.startsWith(TODO_PREFIX) && !value.startsWith("[")) return <>{value}</>;
  return (
    <mark className="rounded-md bg-yellow-200 px-2 py-0.5 text-base font-medium text-yellow-950 ring-1 ring-yellow-500">
      {value}
    </mark>
  );
}
