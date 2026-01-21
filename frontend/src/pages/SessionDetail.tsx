import { useParams } from "react-router-dom";
import HeaderLayout from "../components/HeaderLayout";
import { useAuth } from "../context/AuthContext";
import { useTeachers, type TeacherCourse } from "../hooks/useTeachers";
import { TeacherCard } from "../components/TeacherCard";
import { useSessionSpecific } from "../hooks/useSessions";

export default function SessionDetail() {
  useAuth();
  const { sessionId: sessionIdParam } = useParams<{ sessionId: string }>();
  const sessionId = sessionIdParam ? Number(sessionIdParam) : undefined;

  // fetch session details (for name)
  const { data: session } = useSessionSpecific(sessionId);

  // fetch teachers for this session
  const {
    data: teachers_courses,
    isLoading,
    error
  } = useTeachers(sessionId);

  // get current student ID from localStorage or auth context
  const studentId = Number(localStorage.getItem("user"));

  return (
    <HeaderLayout>
      <section>
        <h1 className="text-2xl font-bold mb-4 text-left">
          Session: {session?.session_name ?? sessionId}
        </h1>

        {isLoading && <div>Loading teachers…</div>}
        {error && <div className="text-red-600">Failed to load teachers</div>}

        {Array.isArray(teachers_courses) && teachers_courses.length > 0 ? (
          <div className="flex flex-col items-center w-full gap-4">
            {teachers_courses.map((tc: TeacherCourse) => (
              <TeacherCard
                key={tc.teacher_id}
                teacher={tc}
                sessionId={sessionId!}
                studentId={studentId}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center">
            No teachers available.
          </div>
        )}
      </section>
    </HeaderLayout>
  );
}
