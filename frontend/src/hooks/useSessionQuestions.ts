import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export function useSessionQuestions(sessionId?: number) {
  return useQuery({
    queryKey: ["sessionQuestions", sessionId],
    queryFn: () => api.get(`/feedback-sessions/${sessionId}/questions`).then(r => r.data),
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000,
  });
}
