import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

export type UpdateSessionPayload = {
  session_name?: string;
  questions_json?: any;
  starts_at?: string;
  closes_at?: string;
};

export function useUpdateSession(sessionId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSessionPayload) =>
      api.put(`/feedback-sessions/${sessionId}`, payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
