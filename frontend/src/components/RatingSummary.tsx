type QuestionDef = {
  text: string;
  type: "rating" | "text" | "yesno";
  range?: [number, number];
};

type RatingSummaryProps = {
  summary: Record<
    string,
    {
      type: string;
      count: number;
      mean: number;
      stddev: number;
      values: number[];
    }
  >;
  questions: Record<string, QuestionDef>;
};

export default function RatingSummary({ summary, questions }: RatingSummaryProps) {
  const ratingQs = Object.entries(summary).filter(
    ([_, v]) => v.type === "rating"
  );

  if (ratingQs.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Rating Questions</h3>

      <div className="grid grid-cols-1 gap-4">
        {ratingQs.map(([qid, data]) => (
          <div key={qid} className="p-3 rounded bg-white">
            <h4 className="font-medium mb-1">{questions[qid].text}</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Count:</strong> {data.count}
              </p>
              <p>
                <strong>Mean:</strong> {data.mean.toFixed(2)}
              </p>
              <p>
                <strong>Std. Dev:</strong> {data.stddev.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
