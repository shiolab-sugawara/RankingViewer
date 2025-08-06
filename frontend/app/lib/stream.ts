import type { Stream } from "../types/stream";

export async function fetchStreams(daysAgo: string): Promise<Stream[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`/api/rankings?days_ago=${daysAgo}`);
  if (!res.ok) {
    throw new Error("ストリームの取得に失敗しました");
  }
  return res.json();
}
