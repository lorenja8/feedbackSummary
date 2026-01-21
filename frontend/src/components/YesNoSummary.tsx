type YesNoSummaryProps = {
  summary: Record<
    string,
    {
      type: "yesno";
      yes: number;
      no: number;
    }
  >;
  questions: Record<string, { text: string }>;
};

export default function YesNoSummary({ summary, questions }: YesNoSummaryProps) {
  // Extract only yes/no questions
  const yesnoQs = Object.entries(summary).filter(
    ([_, v]) => v.type === "yesno"
  );

  if (yesnoQs.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Yes/No Questions</h3>

      <div className="grid grid-cols-1 gap-4">
        {yesnoQs.map(([qid, data]) => {
          const question = questions[qid]?.text ?? `Question ${qid}`;

          return (
            <div key={qid} className="p-4 rounded bg-white">
              <h4 className="font-medium mb-1">{question}</h4>

              <div className="flex gap-8 mt-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Yes</span>
                  <span className="font-semibold">{data.yes}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">No</span>
                  <span className="font-semibold">{data.no}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
