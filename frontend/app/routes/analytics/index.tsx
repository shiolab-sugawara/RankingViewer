import React, { useEffect, useState } from "react";
import {
  fetchFollowerLogs,
  fetchSubscriberLogs,
  fetchVods,
} from "../../lib/api";
import type {
  FollowerLog,
  SubscriberLog,
  Vod,
} from "../../types/stats";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsPage() {
  const [followers, setFollowers] = useState<FollowerLog[]>([]);
  const [subs, setSubs] = useState<SubscriberLog[]>([]);
  const [vods, setVods] = useState<Vod[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchFollowerLogs(),
      fetchSubscriberLogs(),
      fetchVods(),
    ])
      .then(([f, s, v]) => {
        setFollowers(f);
        setSubs(s);
        setVods(v);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>エラー: {error}</p>;
  if (!followers.length && !subs.length && !vods.length) return <p>読み込み中...</p>;

  return (
    <div>
      <h1>📊 Twitch 分析ダッシュボード</h1>

      <h2>フォロワー数の推移</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={followers}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h2>サブスク数の推移</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={subs}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="created_at" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="subscriber_count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <h2>日ごとの配信時間（分）</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={vods}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="created_at" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="duration_minutes" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
