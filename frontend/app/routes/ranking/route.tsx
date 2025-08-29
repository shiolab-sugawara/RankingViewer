import { useEffect, useState } from "react";
import { subDays, format } from "date-fns";
import styles from "./route.module.css";

type StreamRanking = {
  user: string;
  viewers: number;
  thumbnail: string;
  duration: string | null;
  tags: string[];
};

export const clientLoader = () => null;

export default function RankingRoute() {
  const [daysAgo, setDaysAgo] = useState(0);
  const [ranking, setRanking] = useState<StreamRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const date = subDays(new Date(), daysAgo);
  const dateStr = format(date, "yyyy-MM-dd");

  useEffect(() => {
    const stored = localStorage.getItem("favoriteStreamers");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ranking?date=${dateStr}`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch ranking: ${errorText}`);
        }
        const data = await res.json();
        setRanking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [dateStr]);

  const toggleFavorite = (user: string) => {
    const updated = favorites.includes(user)
      ? favorites.filter((name) => name !== user)
      : [...favorites, user];
    setFavorites(updated);
    localStorage.setItem("favoriteStreamers", JSON.stringify(updated));
  };

  const isFavorite = (user: string) => favorites.includes(user);
  const goToday = () => setDaysAgo(0);

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <h1 className={styles.heading}>{dateStr} の配信ランキング</h1>

      <div className={styles.buttonGroup}>
        <button
          onClick={goToday}
          className={`${styles.button} ${daysAgo === 0 ? styles.disabled : ""}`}
          disabled={daysAgo === 0}
        >
          今日
        </button>

        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <button
            key={day}
            onClick={() => setDaysAgo(day)}
            className={`${styles.button} ${daysAgo === day ? styles.disabled : ""}`}
            disabled={daysAgo === day}
          >
            {day}日前
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.text}>読み込み中...</p>
      ) : (
        <div className={styles.cardGrid}>
          {ranking.map((stream, index) => (
            <div key={index} className={styles.card}>
              <img
                src={stream.thumbnail}
                alt={`${stream.user} thumbnail`}
                className={styles.thumbnail}
              />
              <div>
                <h2 className={styles.cardTitle}>
                  #{index + 1} {stream.user}
                </h2>

                <p className={styles.text}>
                  <strong>視聴者数:</strong> {stream.viewers}
                </p>
                <p className={styles.text}>
                  <strong>配信時間:</strong> {stream.duration || "不明"}
                </p>
                <p className={styles.text}>
                  <strong>タグ:</strong>{" "}
                  {stream.tags.length > 0 ? stream.tags.join(", ") : "なし"}
                </p>

                <button
                  onClick={() => toggleFavorite(stream.user)}
                  className={`${styles.button} ${styles.favoriteButton} ${
                    isFavorite(stream.user) ? styles.fav : styles.notFav
                  }`}
                >
                  {isFavorite(stream.user) ? "★ 登録済み" : "☆ お気に入り"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
