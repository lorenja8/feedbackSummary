import { useEffect, useState } from "react";
import { type SessionItem } from "../hooks/useSessions";
import { type CourseItem } from "../hooks/useTeacherCourses";
import { type FeedbackFilters } from "../hooks/useFilteredFeedback";

type FiltersProps = {
  courses: CourseItem[];
  sessions: SessionItem[];
  teacher: number;
  onApply: (data: FeedbackFilters) => void;
};

export default function Filters({ courses, sessions, teacher, onApply }: FiltersProps) {
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  useEffect(() => {
    if (teacher && selectedTeacherId === null) {
      setSelectedTeacherId(teacher);
    }
  }, [teacher]);

  useEffect(() => {
    if (courses?.length && selectedCourseIds.length === 0) {
      setSelectedCourseIds([courses[0].course_id]);
    }

    if (sessions?.length && selectedSessionId === null) {
      setSelectedSessionId(sessions[0].session_id);
    }
  }, [courses, sessions]);

  const toggleCourse = (id: number) => {
    setSelectedCourseIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-3 text-left">Filters</h3>

      <div className="flex flex-wrap gap-16 items-start justify-start">
        {/* SESSION */}
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium mb-1 text-left">Session</label>
          <select
            value={selectedSessionId ?? ""}
            onChange={(e) => setSelectedSessionId(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          >
            {sessions.map((s) => (
              <option key={s.session_id} value={s.session_id}>
                {s.session_name}
              </option>
            ))}
          </select>
        </div>

        {/* COURSES */}
        <div className="min-w-[240px]">
          <label className="block text-sm font-medium mb-1 text-left">Course</label>
          <div className="flex flex-col gap-1">
            {courses.map((c) => (
              <label key={c.course_id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCourseIds.includes(c.course_id)}
                  onChange={() => toggleCourse(c.course_id)}
                />
                <span>{c.course_name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* APPLY BUTTON */}
        <div className="ml-auto">
          <button
            onClick={() =>
              onApply({
                courseIds: selectedCourseIds,
                sessionId: selectedSessionId,
                teacherId: selectedTeacherId ?? undefined,
              })
            }
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
