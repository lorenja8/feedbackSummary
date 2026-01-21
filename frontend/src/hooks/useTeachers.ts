import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export type TeacherCourse = {
  teacher_id: number;
  teacher_name: string;
  course_id: number;
  course_name: string;
};

async function fetchMyTeachers(uid: number | null, sessionId?: number) {
  if (!uid || !sessionId) return [];

  const resp = await api.get(`/tools/teachers-for-student/${uid}?session=${sessionId}`);
  return resp.data;
}


export function useTeachers(sessionId?: number) {
  const me = localStorage.getItem("user");

  return useQuery({
    queryKey: ["teachers", me, sessionId],  
    queryFn: () => fetchMyTeachers(Number(me), sessionId),
    enabled: !!me && !!sessionId,
  });
}