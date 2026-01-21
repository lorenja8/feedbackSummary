import { useState } from "react";
import HeaderLayout from "../components/HeaderLayout";
import { useAuth } from "../context/AuthContext";
import Filters from "../components/Filters";
import { useSessions } from "../hooks/useSessions";
import { useTeacherCourses } from "../hooks/useTeacherCourses";
import { useFilteredFeedback, type FeedbackFilters } from "../hooks/useFilteredFeedback";
import Summary from "../components/Summary";

export default function TeacherDashboard() {
  useAuth();
  const { data: sessions = [] } = useSessions();
  const { data: courses = [] } = useTeacherCourses();
  const teacherId = Number(localStorage.getItem("user"));

  const [filters, setFilters] = useState<FeedbackFilters | null>(null);

  const { data: feedback, isLoading: loadingFeedback } = useFilteredFeedback(filters);

  const questionsForSession = sessions.find(s => s.session_id === filters?.sessionId)?.questions_json;

  return (
    <HeaderLayout>
      <section className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-left">Analysis Workspace</h1>

        <Filters
          courses={courses}
          sessions={sessions}
          teacher={teacherId}
          onApply={(f) => setFilters(f)}
        />

        {loadingFeedback && <p>Loading feedback...</p>}

        {feedback && questionsForSession && (
        <Summary 
          feedback={feedback} 
          questions={questionsForSession} 
          filters={filters} 
          teacherId={teacherId} 
        />

      )}

      </section>
    </HeaderLayout>
  );
}
