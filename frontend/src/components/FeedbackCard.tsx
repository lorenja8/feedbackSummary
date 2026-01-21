import { type SessionItem } from "../hooks/useSessions";
import { format } from "date-fns";

export default function SessionCard({ s }: { s: SessionItem }) {
  const starts = new Date(s.starts_at);
  const closes = new Date(s.closes_at);
  const now = new Date();

  const isOpen = now >= starts && now <= closes;

  return (
    <div className="border rounded p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-left">{s.session_name}</h3>
          <div className="text-sm text-gray-500">
            {format(starts, "dd/MM/yyyy")} — {format(closes, "dd/MM/yyyy")}
          </div>
        </div>
        <div>
          <span className={`px-2 py-1 rounded text-xs ${isOpen ? "bg-green-200 text-green-800" : "bg-red-200 text-gray-700"}`}>
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>
    </div>
  );
}
