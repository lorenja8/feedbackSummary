import { useMemo } from "react";
import TextSummary from "../components/TextSummary";
// import RatingSummary from "../components/RatingSummary";
// import YesNoSummary from "../components/YesNoSummary";
import RatingHistogram from "../components/charts/RatingHistogram";
import YesNoPieChart from "../components/charts/YesNoPieChart";

type SummaryProps = {
  feedback: any[];
  questions: Record<string, { text: string; type: string }>;
  filters: any;
  teacherId: number;
};

export default function Summary({ feedback, questions, filters, teacherId }: SummaryProps) {
  const summary = useMemo(() => {
    const total = feedback.length;
    const perQuestion: Record<string, any> = {};

    Object.entries(questions).forEach(([qid, q]) => {
      const answers = feedback
        .map((f) => f.feedback_json?.[qid])
        .filter((x) => x !== undefined && x !== null);

      if (q.type === "rating") {
        const nums = answers as number[];
        const mean = nums.reduce((a, b) => a + b, 0) / (nums.length || 1);
        const variance =
          nums.reduce((sum, v) => sum + (v - mean) ** 2, 0) /
          (nums.length || 1);
        const stddev = Math.sqrt(variance);

        const distribution: Record<number, number> = {};
        nums.forEach((n) => (distribution[n] = (distribution[n] || 0) + 1));

        perQuestion[qid] = { type: "rating", mean, stddev, distribution };
      }

      if (q.type === "yesno") {
        const yes = answers.filter((v) => v === true || v === "yes").length;
        const no = answers.filter((v) => v === false || v === "no").length;
        perQuestion[qid] = { type: "yesno", yes, no };
      }

      if (q.type === "text") {
        perQuestion[qid] = {
          type: "text",
          texts: answers as string[],
          count: answers.length,
        };
      }
    });

    return { total, perQuestion };
  }, [feedback, questions]);

  return (
    <div className="bg-white p-4 rounded shadow-sm space-y-4">

      <h2 className="text-xl font-semibold mb-2 text-left">Summary</h2>

      <p className="text-sm text-gray-600 text-left">
        Total feedback responses: <strong>{summary.total}</strong>
      </p>

      {/* Non-text questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(questions).map((qid) => {
          const q = questions[qid];
          const data = summary.perQuestion[qid];
          if (!data || q.type === "text") return null;

          return (
            <div key={qid} className="border rounded p-4 space-y-4">
              <h4 className="font-semibold text-gray-800 text-left">{q.text}</h4>

              {q.type === "rating" && (
                <>
                  {/*<RatingSummary summary={{ [qid]: data }} questions={{ [qid]: q }} />*/}
                  <RatingHistogram questionText={q.text} distribution={data.distribution} />
                </>
              )}

              {q.type === "yesno" && (
                <>
                  {/*<YesNoSummary summary={{ [qid]: data }} questions={{ [qid]: q }} />*/}
                  <YesNoPieChart questionText={q.text} yes={data.yes} no={data.no} />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Text questions + AI */}
      <div>
        <TextSummary
          summary={summary.perQuestion}
          questions={questions}
          filters={filters}
          reviewed_teacher_id={teacherId}
        />
      </div>
    </div>
  );
}
