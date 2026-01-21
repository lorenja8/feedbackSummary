import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export type SessionItem = {
  session_id: number;
  session_name: string;
  starts_at: string; // ISO
  closes_at: string; // ISO
  questions_json: any;
};

// async function fetchSessions(): Promise<SessionItem[]> {
//   const resp = await api.get("/feedback-sessions/");
//   return resp.data;
// }

async function fetchSessions(): Promise<SessionItem[]> {
  const resp = await api.get("/feedback-sessions/");

  // Ensure we always return an array of valid session objects
  if (!Array.isArray(resp.data)) return [];
  return resp.data.map(s => ({
    ...s,
    starts_at: s.starts_at ?? null,
    closes_at: s.closes_at ?? null,
  }));
}

async function fetchSessionSpecific(sessionId: number): Promise<SessionItem> {
  const resp = await api.get(`/feedback-sessions/${sessionId}`);
  return resp.data;
}

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useSessionSpecific(sessionId?: number) {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSessionSpecific(sessionId!),
    enabled: !!sessionId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
