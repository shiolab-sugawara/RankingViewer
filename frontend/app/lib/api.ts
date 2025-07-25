import type { FollowerLog, SubscriberLog, Vod } from "../types/stats";

export async function fetchFollowerLogs(): Promise<FollowerLog[]> {
  const res = await fetch("/api/followers");
  if (!res.ok) throw new Error("Failed to fetch followers");
  return res.json();
}

export async function fetchSubscriberLogs(): Promise<SubscriberLog[]> {
  const res = await fetch("/api/subscriber_logs");
  if (!res.ok) throw new Error("Failed to fetch subscribers");
  return res.json();
}

export async function fetchVods(): Promise<Vod[]> {
  const res = await fetch("/api/vods");
  if (!res.ok) throw new Error("Failed to fetch vods");
  return res.json();
}