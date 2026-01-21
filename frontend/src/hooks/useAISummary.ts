import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export type AISummaryFilters = {
  courseIds: number[];
  sessionId: number;
  teacherId: number;
  questionId: string;
};

async function fetchAISummary(filters: AISummaryFilters) {
  const payload = {
    course_ids: filters.courseIds,
    session_id: filters.sessionId,
    reviewed_teacher_id: filters.teacherId,
    question_id: filters.questionId,
  };

  const resp = await api.post("/feedback-entries/summary", payload);
  return resp.data;
}

export function useAISummary(filters: AISummaryFilters | null) {
  return useQuery({
    queryKey: ["aiSummary", filters],
    queryFn: () => fetchAISummary(filters!),
    enabled: !!filters,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
