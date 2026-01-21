import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

export type CreateSessionPayload = {
  session_name: string;
  questions_json: any;
  starts_at: string;
  closes_at: string;
};

export function useCreateSession() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) =>
      api.post("/feedback-sessions/", payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}
