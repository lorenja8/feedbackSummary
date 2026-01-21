type Question = {
  text: string;
  type: "text" | "yesno" | "rating";
  range?: [number, number];
};

type Props = {
  questions: Record<string, Question>;
  onChange: (q: Record<string, Question>) => void;
  disabled: boolean;
};

export default function QuestionEditor({ questions, onChange, disabled }: Props) {
  function updateQuestion(qid: string, patch: Partial<Question>) {
    onChange({
      ...questions,
      [qid]: { ...questions[qid], ...patch },
    });
  }

  function deleteQuestion(qid: string) {
    const copy = { ...questions };
    delete copy[qid];
    onChange(copy);
  }

  function addQuestion() {
    const id = `q${Object.keys(questions).length + 1}`;
    onChange({
      ...questions,
      [id]: { text: "New question", type: "text" },
    });
  }

  return (
    <div className="space-y-8">
      <h4 className="font-medium text-left font-semibold">Questions</h4>

      {Object.entries(questions).map(([qid, q]) => (
        <div key={qid} className="rounded space-y-2">
          <input
            value={q.text}
            onChange={(e) => updateQuestion(qid, { text: e.target.value })}
            disabled={disabled}
            className="border p-1 w-full rounded"
          />

          <div className="flex items-center gap-2">
            <select
              value={q.type}
              onChange={(e) =>
                updateQuestion(qid, { type: e.target.value as any })
              }
              disabled={disabled}
              className="border p-1 rounded"
            >
              <option value="text">Text</option>
              <option value="yesno">Yes / No</option>
              <option value="rating">Rating</option>
            </select>

            {q.type === "rating" && (
              <>
                <input
                  type="number"
                  value={q.range?.[0] ?? 0}
                  onChange={(e) =>
                    updateQuestion(qid, {
                      range: [Number(e.target.value), q.range?.[1] ?? 10],
                    })
                  }
                  disabled={disabled}
                  className="border p-1 w-16 rounded"
                />
                <input
                  type="number"
                  value={q.range?.[1] ?? 10}
                  onChange={(e) =>
                    updateQuestion(qid, {
                      range: [q.range?.[0] ?? 0, Number(e.target.value)],
                    })
                  }
                  disabled={disabled}
                  className="border p-1 w-16 rounded"
                />
              </>
            )}

            {!disabled && (
              <button
                onClick={() => deleteQuestion(qid)}
                className="text-sm text-red-600 hover:underline ml-auto"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}

      {!disabled && (
        <button
          onClick={addQuestion}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add question
        </button>
      )}

      {disabled && (
        <p className="text-sm text-gray-500">
          Questions cannot be modified once feedback exists or after the session starts.
        </p>
      )}
    </div>
  );
}
