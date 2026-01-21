import { useState, useEffect, useMemo } from "react";
import { useSaveFeedback } from "../hooks/useSaveFeedback";
import QuestionRenderer from "../components/QuestionRenderer";
import { type Question } from "../components/QuestionRenderer";

export type QuestionsJSON = Record<string, Question>;

export type TeacherEvaluationFormProps = {
  questions?: QuestionsJSON;
  initialAnswers?: Record<string, any>;
  sessionId: string | number;
  teacherId: number;
  studentId: number;
  courseId: number;
};

export default function TeacherEvaluationForm({
  questions,
  initialAnswers,
  sessionId,
  teacherId,
  studentId,
  courseId,
}: TeacherEvaluationFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers ?? {});
  const [isDirty, setIsDirty] = useState(false);
  const saveMutation = useSaveFeedback();
  
  // convert dict -> array
   const questionList = useMemo(() => {
    if (!questions) return [];
    return Object.entries(questions).map(([id, q]) => ({
      id,
      ...q
    }));
  }, [questions]);

  useEffect(() => {
    setAnswers(initialAnswers ?? {});
    setIsDirty(false);
  }, [initialAnswers]);

    // warn on leave
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleChange = (qid: string, value: any) => {
    setAnswers(prev => {
      const next = { ...prev, [qid]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(initialAnswers ?? {}));
      return next;
    });
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync({
      session_id: Number(sessionId),
      reviewed_teacher_id: teacherId,
      reviewing_student_id: studentId,
      reviewed_course_id: courseId,
      feedback_json: answers
    });
    setIsDirty(false);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      {questionList.map(q => (
        <QuestionRenderer
          key={q.id}
          question={q}
          value={answers[q.id] ?? ""}
          onChange={(v: string | number) => handleChange(q.id, v)}
        />
      ))}

    <div className="controls flex justify-end">
    <button
      disabled={!isDirty || saveMutation.status === "pending"}
      className={`px-3 py-1 rounded transition-colors
        ${isDirty
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-blue-300 text-white"}
        ${saveMutation.status === "pending" ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {saveMutation.status === "pending" ? "Saving..." : "Save"}
    </button>

    </div>

    </form>
  );
}
