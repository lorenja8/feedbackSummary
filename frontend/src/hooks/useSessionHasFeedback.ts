import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export function useSessionHasFeedback(sessionId?: number) {   
  return useQuery({
    queryKey: ["sessionHasFeedback", sessionId],
    queryFn: () =>
      api.get(`/feedback-entries/session/${sessionId}/has-feedback`).then(r => r.data),
    enabled: !!sessionId,
    staleTime: 60_000,
  });
}
