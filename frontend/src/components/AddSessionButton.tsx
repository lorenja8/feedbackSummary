import { useCreateSession } from "../hooks/useCreateSession";

export default function AddSessionButton() {
  const create = useCreateSession();

  function handleAdd() {
    const now = new Date();
    const inTwoWeeks = new Date();
    inTwoWeeks.setDate(now.getDate() + 14);

    create.mutate({
      session_name: "New session",
      questions_json: {},
      starts_at: inTwoWeeks.toISOString(),
      closes_at: inTwoWeeks.toISOString(),
    });
  }

  return (
    <button
      onClick={handleAdd}
      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
    >
      + Add Session
    </button>
  );
}
