import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import api from "../api/client";

export type FeedbackPayload = {
  reviewed_teacher_id: number;
  reviewing_student_id: number;
  reviewed_course_id: number;
  session_id: number;
  feedback_json: any;
};

export function useSaveFeedback(): UseMutationResult<
  any,
  Error,
  FeedbackPayload,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FeedbackPayload) =>
      api.post("/feedback-entries/", payload).then(r => r.data),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: [
          "feedback",
          payload.session_id,
          payload.reviewed_teacher_id,
          payload.reviewing_student_id,
          payload.reviewed_course_id
        ]
      });
    }
  });
}
