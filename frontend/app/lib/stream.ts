import type { Stream } from "../types/stream";

export async function fetchStreams(daysAgo: string): Promise<Stream[]> {
  const res = await fetch(`/api/streams?days_ago=${daysAgo}`);
  if (!res.ok) {
    throw new Error("ストリームの取得に失敗しました");
  }
  return res.json();
}
