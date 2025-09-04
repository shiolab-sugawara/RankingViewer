// src/pages/AnalyticsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
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
  ComposedChart,
  Legend,
  Cell,
} from "recharts";
import "./route.module.css";

function CustomTooltip({ active, label, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const count = payload.find((p: any) => p.dataKey === "count");
  const delta = payload.find((p: any) => p.dataKey === "delta");

  const deltaVal = Number(delta?.value ?? 0);
  const deltaText = deltaVal === 0 ? "0人" : deltaVal > 0 ? `+${deltaVal}人` : `${deltaVal}人`;
  const deltaClass =
    deltaVal > 0
      ? "ap-tooltip__row ap-tooltip__row--delta-plus"
      : deltaVal < 0
      ? "ap-tooltip__row ap-tooltip__row--delta-minus"
      : "ap-tooltip__row ap-tooltip__row--delta-zero";

  return (
    <div className="ap-tooltip">
      <div className="ap-tooltip__label">{label}</div>
      {count && (
        <div className="ap-tooltip__row ap-tooltip__row--count">
          フォロワー数： {count.value}人
        </div>
      )}
      {delta && <div className={deltaClass}>前日比： {deltaText}</div>}
    </div>
  );
}

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
        const msg = err instanceof Error ? err.message : "不明なエラーが発生しました。";
        setError(msg);
      });
  }, []);

  const followersWithDelta = useMemo(() => {
    const sorted = [...followers].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted.map((d, i) => {
      const prev = sorted[i - 1];
      const delta = i === 0 ? 0 : d.count - (prev?.count ?? d.count);
      return { ...d, delta };
    });
  }, [followers]);

  const formatDelta = (v: number) => (v === 0 ? "0" : v > 0 ? `+${v}` : `${v}`);

  if (error) return <p className="ap-error">エラー: {error}</p>;
  if (!followers.length) return <p className="ap-loading">読み込み中...</p>;

  return (
    <div className="ap-container">
      <h1 className="ap-title">📊 Twitch 分析ダッシュボード</h1>

      <section className="ap-card">
        <div className="ap-chart">
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={followersWithDelta} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                type="category"
                allowDuplicatedCategory={false}
                padding={{ left: 40, right: 40 }}
              />
              <YAxis yAxisId="count" />
              <YAxis yAxisId="delta" orientation="right" tickFormatter={(v) => formatDelta(Number(v))} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={(props) => {
                  const { payload } = props as any;
                  const latest = followersWithDelta[followersWithDelta.length - 1];
                  return (
                    <div className="ap-legend">
                      <ul className="ap-legend__list">
                        {payload?.map((entry: any, index: number) => {
                          let itemClass = "ap-legend__item ap-legend__item--delta-zero";
                          if (entry.dataKey === "count") itemClass = "ap-legend__item ap-legend__item--count";
                          if (entry.dataKey === "delta") {
                            if (latest?.delta > 0) itemClass = "ap-legend__item ap-legend__item--delta-plus";
                            else if (latest?.delta < 0) itemClass = "ap-legend__item ap-legend__item--delta-minus";
                          }
                          return (
                            <li key={index} className={itemClass}>
                              <span className="ap-legend__dot" />
                              {entry.value}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                }}
              />
              <Bar yAxisId="delta" dataKey="delta" name="前日比" radius={[4, 4, 0, 0]} barSize={22}>
                {followersWithDelta.map((entry, index) => {
                  const c = entry.delta > 0 ? "#16a34a" : entry.delta < 0 ? "#dc2626" : "#9ca3af";
                  return <Cell key={`cell-${index}`} fill={c} />;
                })}
              </Bar>
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="count"
                name="フォロワー数"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
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
              <Line type="monotone" dataKey="subscriber_count" stroke="#22c55e" />
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
