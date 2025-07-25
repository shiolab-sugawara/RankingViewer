export type FollowerLog = {
  date: string;
  count: number;
};

export type SubscriberLog = {
  created_at: string;
  subscriber_count: number;
};

export type Vod = {
  created_at: string;
  duration_minutes: number;
};
