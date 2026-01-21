import { useState } from "react";
import { useSessionQuestions } from "../hooks/useSessionQuestions";
import { useFilteredFeedback } from "../hooks/useFilteredFeedback";
import TeacherEvaluationForm from "./TeacherEvaluationForm";

export type TeacherCourse = {
  teacher_id: number;
  teacher_name: string;
  course_id: number;
  course_name: string;
};

export type TeacherCardProps = {
  teacher: TeacherCourse;
  sessionId: number;
  studentId: number;
};

export function TeacherCard({ teacher, sessionId, studentId }: TeacherCardProps) {
  const [open, setOpen] = useState(false);

  const { data: questions, isLoading: questionsLoading, error: questionsError } =
    useSessionQuestions(sessionId);

  const { data: feedbackList, isLoading: feedbackLoading, error: feedbackError } =
    useFilteredFeedback({
      sessionId,
      teacherId: teacher.teacher_id,
      studentId,
      courseIds: [teacher.course_id],
    });

  const existing = feedbackList?.[0] ?? null;

  return (
    <div className="rounded border bg-white overflow-hidden w-full">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-100 focus:outline-none"
      >
        <div>
          <div className="font-semibold">{teacher.teacher_name}</div>
          <div className="text-sm text-gray-600">{teacher.course_name}</div>
        </div>
        <div className="text-gray-500">{open ? "▲" : "▼"}</div>
      </button>

      {open && (
        <div className="p-4 border-t">
          {questionsLoading || feedbackLoading ? (
            <div>Loading...</div>
          ) : questionsError || feedbackError ? (
            <div className="text-red-600">Failed to load evaluation form.</div>
          ) : (
            <TeacherEvaluationForm
              questions={questions}
              initialAnswers={existing?.feedback_json ?? {}}
              sessionId={sessionId}
              teacherId={teacher.teacher_id}
              courseId={teacher.course_id}
              studentId={studentId}
            />
          )}
        </div>
      )}
    </div>
  );
}
