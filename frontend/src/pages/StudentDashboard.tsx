import HeaderLayout from "../components/HeaderLayout";
import { useAuth } from "../context/AuthContext";
import { useSessions } from "../hooks/useSessions";
import SessionCard from "../components/SessionCard";
import { Link } from "react-router-dom";


export default function StudentDashboard() {
  useAuth();
  const { data: sessions, isLoading, error } = useSessions();

  return (
    <HeaderLayout >

      <section>
        <h1 className="text-2xl font-bold mb-4 text-left">Feedback Sessions</h1>

        {isLoading && <div>Loading sessions…</div>}
        {error && <div className="text-red-600">Failed to load sessions</div>}

        <div className="flex flex-col items-center w-full gap-4">
          {sessions?.map((s: any) => (
            <Link to={`/student/session/${s.session_id}`} key={s.session_id} className="w-full">
              <SessionCard s={s} />
            </Link>
          )) || <div className="text-sm text-gray-500 text-center">No sessions available.</div>}
        </div>
      </section>
    </HeaderLayout>

  );
}