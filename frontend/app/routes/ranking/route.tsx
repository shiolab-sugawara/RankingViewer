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

type FavoriteItem = StreamRanking & {
  date: string;
  rank: number;
};

type FavoriteMap = Record<string, FavoriteItem>;

const STORAGE_V1 = "favoriteStreamers";
const STORAGE_V2 = "favoriteStreamersV2";

export const clientLoader = () => null;

export default function RankingRoute() {
  const [daysAgo, setDaysAgo] = useState(0);
  const [ranking, setRanking] = useState<StreamRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteMap>({});

  const date = subDays(new Date(), daysAgo);
  const dateStr = format(date, "yyyy-MM-dd");

  const twitchUrl = (user: string) =>
    `https://www.twitch.tv/${encodeURIComponent(user.toLowerCase())}`;

  useEffect(() => {
    const v2raw = localStorage.getItem(STORAGE_V2);
    if (v2raw) {
      try {
        setFavorites(JSON.parse(v2raw));
        return;
      } catch {}
    }

    const v1raw = localStorage.getItem(STORAGE_V1);
    if (v1raw) {
      try {
        const arr: string[] = JSON.parse(v1raw);
        const migrated: FavoriteMap = {};
        arr.forEach((name) => {
          migrated[name] = {
            user: name,
            viewers: 0,
            thumbnail: "",
            duration: null,
            tags: [],
            date: "",
            rank: 0,
          };
        });
        setFavorites(migrated);
        localStorage.setItem(STORAGE_V2, JSON.stringify(migrated));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_V2, JSON.stringify(favorites));
  }, [favorites]);

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

  const toggleFavorite = (stream: StreamRanking, rankIndex: number) => {
    setFavorites((prev) => {
      const exists = !!prev[stream.user];
      if (exists) {
        const { [stream.user]: _, ...rest } = prev;
        return rest;
      } else {
        const item: FavoriteItem = {
          ...stream,
          date: dateStr,
          rank: rankIndex + 1,
        };
        return { ...prev, [stream.user]: item };
      }
    });
  };

  const isFavorite = (user: string) => !!favorites[user];
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
            className={`${styles.button} ${
              daysAgo === day ? styles.disabled : ""
            }`}
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
            <div key={`${stream.user}-${index}`} className={styles.card}>
              <a
                href={twitchUrl(stream.user)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${stream.user} を視聴する (新しいタブ)`}
              >
                <img
                  src={stream.thumbnail}
                  alt={`${stream.user} thumbnail`}
                  className={styles.thumbnail}
                />
              </a>

              <div>
                <h2 className={styles.cardTitle}>
                  <a
                    href={twitchUrl(stream.user)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                    aria-label={`${stream.user} を視聴する (新しいタブ)`}
                  >
                    #{index + 1} {stream.user}
                  </a>
                </h2>

                <p className={styles.text}>
                  <strong>視聴者数:</strong> {stream.viewers.toLocaleString()}
                </p>
                <p className={styles.text}>
                  <strong>配信時間:</strong> {stream.duration || "不明"}
                </p>
                <p className={styles.text}>
                  <strong>タグ:</strong>{" "}
                  {stream.tags.length > 0 ? stream.tags.join(", ") : "なし"}
                </p>

                <button
                  onClick={() => toggleFavorite(stream, index)}
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
