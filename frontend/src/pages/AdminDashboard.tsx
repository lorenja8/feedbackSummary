import HeaderLayout from "../components/HeaderLayout";
import { useAuth } from "../context/AuthContext";
import { useSessions } from "../hooks/useSessions";
import SessionEditorCard from "../components/SessionEditorCard";
import AddSessionButton from "../components/AddSessionButton";

export default function AdminDashboard() {
  useAuth();
  const { data: sessions, isLoading } = useSessions();

  const sorted = [...(sessions ?? [])].sort(
    (a, b) => new Date(b.closes_at).getTime() - new Date(a.closes_at).getTime()
  );

  return (
    <HeaderLayout>
      <section className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Session Editor</h1>
          <AddSessionButton />
        </div>

        {isLoading && <p>Loading sessions...</p>}

        <div className="space-y-4">
          {sorted.map((s) => (
            <SessionEditorCard key={s.session_id} session={s} />
          ))}
        </div>
      </section>
    </HeaderLayout>
  );
}
