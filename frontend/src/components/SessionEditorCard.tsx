import { useState, useMemo } from "react";
import { type SessionItem } from "../hooks/useSessions";
import { format } from "date-fns";
import { useUpdateSession } from "../hooks/useUpdateSession";
import { useDeleteSession } from "../hooks/useDeleteSession";
import { useSessionHasFeedback } from "../hooks/useSessionHasFeedback";
import QuestionEditor from "./QuestionEditor";

export default function SessionEditorCard({ session }: { session: SessionItem }) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(session);
  const [dirty, setDirty] = useState(false);

  const update = useUpdateSession(session.session_id);
  const del = useDeleteSession();
  const { data: hasFeedback } = useSessionHasFeedback(session.session_id);

  const now = new Date();
  const starts = new Date(session.starts_at);
  const closes = new Date(session.closes_at);

  const isStarted = now >= starts;
  // console.log(feedbackInfo);
  // const hasFeedback = feedbackInfo?.has_feedback === true;
  // console.log(hasFeedback);

  const status = useMemo(() => {
    if (now >= starts && now <= closes) return "Open";
    if (now < starts) return "Upcoming";
    return "Closed";
  }, [starts, closes]);

  function updateField<K extends keyof SessionItem>(key: K, value: SessionItem[K]) {
    setDraft(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function handleSave() {
    update.mutate({
      session_name: draft.session_name,
      starts_at: draft.starts_at,
      closes_at: draft.closes_at,
      questions_json: draft.questions_json,
    });
    setDirty(false);
  }

  function handleDelete() {
    const ok = window.confirm(
      hasFeedback
        ? "This session has feedback. Deleting it will permanently remove all responses. Continue?"
        : "Delete this session?"
    );
    if (!ok) return;

    del.mutate(session.session_id);
  }

  return (
    <div className="border rounded bg-white shadow-sm">
      {/* Header */}
      <div
        className="p-4 cursor-pointer flex justify-between items-start"
        onClick={() => setExpanded(e => !e)}
      >
        <div>
          <h3 className="font-semibold text-lg text-left">{session.session_name}</h3>
          <div className="text-sm text-gray-500">
            {format(starts, "dd/MM/yyyy")} — {format(closes, "dd/MM/yyyy")}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs bg-gray-200">{status}</span>
          {hasFeedback && (
            <span className="px-2 py-1 rounded text-xs bg-yellow-200 text-yellow-800">
              Has feedback
            </span>
          )}
          {dirty && (
            <span className="px-2 py-1 rounded text-xs bg-blue-200 text-blue-800">
              Unsaved
            </span>
          )}
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t p-4 space-y-4">
          {/* Session meta */}
          <h4 className="font-medium text-left font-semibold">Session info</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* Session Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 text-left">
                Name
              </label>
              <input
                value={draft.session_name}
                onChange={(e) => updateField("session_name", e.target.value)}
                disabled={isStarted}
                className="border p-2 rounded"
                placeholder="Session name"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 text-left">
                Start date
              </label>

              <input
                type="datetime-local"
                value={
                  draft.starts_at
                    ? new Date(draft.starts_at).toLocaleString("sv-SE").slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  updateField("starts_at", new Date(e.target.value).toISOString())
                }
                disabled={isStarted}
                className="border p-2 rounded"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 text-left">
                End date
              </label>
              {/*<span className="text-xs text-gray-500 mb-1">
                When the session automatically closes.
              </span>*/}
              <input
                type="datetime-local"
                value={
                  draft.closes_at
                    ? new Date(draft.closes_at).toLocaleString("sv-SE").slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  updateField("closes_at", new Date(e.target.value).toISOString())
                }
                disabled={isStarted}
                className="border p-2 rounded"
              />
            </div>
          </div>        

          {/* Questions */}
          <QuestionEditor
            questions={draft.questions_json}
            onChange={(q) => {
              setDraft(prev => ({ ...prev, questions_json: q }));
              setDirty(true);
            }}
            disabled={isStarted || hasFeedback}
          />

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:underline"
            >
              Delete session
            </button>

            <button
              onClick={handleSave}
              disabled={!dirty || isStarted}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
