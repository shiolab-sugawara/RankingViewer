// src/pages/AnalyticsPage.tsx
import React, { useEffect, useState } from "react";
import {
  fetchFollowerLogs,
  fetchSubscriberLogs,
  fetchVods,
} from "../../lib/api";
import type { FollowerLog, SubscriberLog, Vod } from "../../types/stats";

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

import "./route.module.css";

export default function AnalyticsPage() {
  const [followers, setFollowers] = useState<FollowerLog[]>([]);
  const [subs, setSubs] = useState<SubscriberLog[]>([]);
  const [vods, setVods] = useState<Vod[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchFollowerLogs(), fetchSubscriberLogs(), fetchVods()])
      .then(([f, s, v]) => {
        setFollowers(f);
        setSubs(s);
        setVods(v);
      })
      .catch((err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "不明なエラーが発生しました。";
        setError(msg);
      });
  }, []);

  if (error) return <p className="ap-error">エラー: {error}</p>;
  if (!followers.length) return <p className="ap-loading">読み込み中...</p>;

  return (
    <div className="ap-container">
      <h1 className="ap-title">📊 Twitch 分析ダッシュボード</h1>

      <section className="ap-card">
        <h2 className="ap-card__title">フォロワー数の推移</h2>
        <div className="ap-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={followers}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="ap-card">
        <h2 className="ap-card__title">サブスク数の推移</h2>
        <div className="ap-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={subs}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="created_at" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="subscriber_count"
                stroke="#22c55e"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="ap-card">
        <h2 className="ap-card__title">日ごとの配信時間（分）</h2>
        <div className="ap-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vods}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="created_at" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="duration_minutes" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
