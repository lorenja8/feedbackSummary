import { useState } from "react";
import { useAISummary, type AISummaryFilters } from "../hooks/useAISummary";

type TextSummaryProps = {
  summary: Record<string, any>;
  questions: Record<string, { text: string }>;
  filters: {
    courseIds: number[];
    sessionId: number;
  };
  reviewed_teacher_id: number;
};

export default function TextSummary({
  summary,
  questions,
  filters,
  reviewed_teacher_id,
}: TextSummaryProps) {
  const textQs = Object.entries(summary).filter(([_, v]) => v.type === "text");

  const [activeQid, setActiveQid] = useState<string | null>(null);
  const [openTrait, setOpenTrait] = useState<string | null>(null);

  const aiFilters: AISummaryFilters | null =
    activeQid && filters
      ? {
          courseIds: filters.courseIds,
          sessionId: filters.sessionId,
          teacherId: reviewed_teacher_id,
          questionId: activeQid,
        }
      : null;

  const { data, isLoading } = useAISummary(aiFilters);

  if (textQs.length === 0) return null;

  return (
    <div className="mt-10 space-y-8">
      {textQs.map(([qid, dataItem]) => {
        const question = questions[qid]?.text ?? `Question ${qid}`;
        const texts = dataItem.texts;

        return (
          <div key={qid} className="p-4 border rounded shadow space-y-4">
            {/* Question + Button */}
            <div className="flex items-center gap-3">
              <h4 className="font-semibold text-gray-800 text-left">{question}</h4>
              <button
                onClick={() => setActiveQid(qid)}
                disabled={isLoading && activeQid === qid}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 ml-auto"
              >
                {isLoading && activeQid === qid ? "Analyzing..." : "Generate AI Summary"}
              </button>
            </div>

            {/* AI Summary */}
            {activeQid === qid && data && (
              <div className="bg-white p-3 rounded space-y-4">
                {/* Sentiment */}
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">Overall sentiment:</span>
                  <span className="text-lg font-bold uppercase">
                    {data.overall_sentiment}
                  </span>
                </div>

                {/* Traits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.traits?.map((t: any) => {
                    const isOpen = openTrait === t.trait;
                    const percentage =
                      t.percentage ??
                      Math.round((t.examples.length / texts.length) * 100);

                    return (
                      <div
                        key={t.trait}
                        onClick={() =>
                          setOpenTrait(isOpen ? null : t.trait)
                        }
                        className="border rounded p-2 cursor-pointer hover:bg-gray-50"
                      >
                        {/* Trait header */}
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{t.trait}</span>
                          <span className="text-sm text-gray-600">
                            {percentage}%
                          </span>
                        </div>

                        {/* Examples */}
                        {isOpen && (
                          <div className="mt-2 text-sm text-gray-700 space-y-1">
                            {t.examples.map((e: string, i: number) => (
                              <p key={i}>“{e}”</p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Show Answers (bottom) */}
            <details className="pt-2">
              <summary className="text-blue-600 underline cursor-pointer text-left">
                Show answers
              </summary>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                {texts.map((t: string, i: number) => (
                  <div key={i} className="text-left">
                    {t}
                  </div>
                ))}
              </div>
            </details>
          </div>
        );
      })}
    </div>
  );
}
