import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

async function fetchMe(me?: string | null) {
  if (!me) {
    // No user stored → call login without ID
    const r = await api.get("/users");
    return r.data;
  }

  const r = await api.get(`/users/${me}`);
  return r.data;
}

export function useUser() {
  const me = localStorage.getItem("user");

  return useQuery({
    queryKey: ["me", me],
    queryFn: () => fetchMe(me),
  });
}