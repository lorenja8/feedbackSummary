import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export type CourseItem = {
  course_id: number;
  course_name: string;
};

async function fetchTeacherCourses(): Promise<CourseItem[]> {
    const me = localStorage.getItem("user");
    const resp = await api.get(`/tools/courses-for-teacher/${me}`);
    return resp.data;
}

export function useTeacherCourses() {
    return useQuery({
        queryKey: ["teacherCourses"],
        queryFn: fetchTeacherCourses,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    });
    }
