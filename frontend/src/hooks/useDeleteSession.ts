import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

export function useDeleteSession() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) =>
      api.delete(`/feedback-sessions/${sessionId}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
