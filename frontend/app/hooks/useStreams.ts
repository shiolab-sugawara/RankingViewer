import { useQuery } from "@tanstack/react-query";
import { fetchStreams } from "../lib/stream";
import type { Stream } from "../types/stream";

export function useStreams(daysAgo: string) {
  return useQuery<Stream[]>({
    queryKey: ["streams", daysAgo],
    queryFn: () => fetchStreams(daysAgo),
  });
}
