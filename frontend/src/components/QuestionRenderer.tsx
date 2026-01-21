export type Question = {
  text: string;
  type: "rating" | "text" | "yesno";
  range?: [number, number]; // only for rating
};

export type QuestionRendererProps = {
  question: Question;
  value: any;
  onChange: (value: any) => void;
};

export default function QuestionRenderer({
  question,
  value,
  onChange
}: QuestionRendererProps) {
  switch (question.type) {
    case "rating":
      const min = question.range?.[0] ?? 1;
      const max = question.range?.[1] ?? 5;
      return (
        <div className="mb-4 flex justify-between items-center">
          <label className="block mb-1 font-medium text-left">{question.text}</label>
          <select
            value={value ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value="">Choose</option>
            {Array.from({ length: max - min + 1 }, (_, i) => (
              <option key={i} value={min + i}>
                {min + i}
              </option>
            ))}
          </select>
        </div>
      );
    case "text":
      return (
        <div className="mb-4">
          <label className="block mb-1 font-medium text-left">{question.text}</label>
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>
      );
    case "yesno":
      return (
        <div className="mb-4 flex justify-between items-center">
          <label className="block mb-1 font-medium text-left">{question.text}</label>
          <select
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value === "true")}
            className="border rounded px-2 py-1"
          >
            <option value="">Choose</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      );
    default:
      return <div>Unknown question type: {question.type}</div>;
  }
}
