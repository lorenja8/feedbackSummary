import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export type FeedbackEntry = {
  feedback_id: number;
  session_id: number;
  reviewed_teacher_id: number;
  reviewing_student_id: number;
  created_at: string;
  feedback_json: Record<string, any>;
};

export type FeedbackFilters = {
  courseIds?: number[];
  sessionId?: number | null;
  teacherId?: number;
  studentId?: number;
};

async function fetchFilteredFeedback(filters: FeedbackFilters): Promise<FeedbackEntry[]> {
  const payload = {
    course_ids: filters.courseIds ?? null,
    session_id: filters.sessionId ?? null,
    reviewed_teacher_id: filters.teacherId ?? null,
    reviewing_student_id: filters.studentId ?? null,
  };

  const resp = await api.post("/feedback-entries/filter", payload);
  return resp.data;
}

export function useFilteredFeedback(filters: FeedbackFilters | null) {
  return useQuery({
    queryKey: ["filteredFeedback", filters],
    queryFn: () => fetchFilteredFeedback(filters!),
    enabled: !!filters,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
