import { useEffect, useState } from "react";
import { subDays, format } from "date-fns";
import styles from "./route.module.css";

type StreamRanking = {
  user: string;
  viewers: number;
  thumbnail: string;
  duration: string | null;
  tags: string[];
  gameId?: string;
  gameName?: string;
};

type FavoriteItem = StreamRanking & {
  date: string;
  rank: number;
};

type FavoriteMap = Record<string, FavoriteItem>;

const STORAGE_V1 = "favoriteStreamers";
const STORAGE_V2 = "favoriteStreamersV2";

export const clientLoader = () => null;

// 受け取るJSONのsnake/camel差を吸収
const normalizeRow = (row: any): StreamRanking => ({
  user: row.user,
  viewers: Number(row.viewers) || 0,
  thumbnail: row.thumbnail || "",
  duration: row.duration ?? null,
  tags: Array.isArray(row.tags) ? row.tags : [],
  gameId: row.gameId ?? row.game_id ?? undefined,
  gameName: row.gameName ?? row.game_name ?? undefined,
});

export default function RankingRoute() {
  const [daysAgo, setDaysAgo] = useState(0);
  const [ranking, setRanking] = useState<StreamRanking[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteMap>({});

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedGameName, setSelectedGameName] = useState<string | null>(null);

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
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const apply = () => setDarkMode(!!mql?.matches);
    apply();
    mql?.addEventListener("change", apply);
    return () => mql?.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRanking = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedGameId) {
          params.set("game_id", selectedGameId);
        } else {
          params.set("date", dateStr);
        }

        const res = await fetch(`/api/ranking?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch ranking: ${errorText}`);
        }
        const raw = await res.json();
        const normalized: StreamRanking[] = Array.isArray(raw)
          ? raw.map(normalizeRow)
          : [];
        setRanking(normalized);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setRanking([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
    return () => controller.abort();
  }, [dateStr, selectedGameId]);

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

  const clearGameFilter = () => {
    setSelectedGameId(null);
    setSelectedGameName(null);
  };

  const handleClickCategory = (id?: string, name?: string) => {
    if (!id) return;
    if (selectedGameId === id) {
      clearGameFilter();
    } else {
      setSelectedGameId(id);
      setSelectedGameName(name ?? null);
    }
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <h1 className={styles.heading}>
        {dateStr} の配信ランキング
        {selectedGameId && (
          <span className={styles.filterBadge}>
            カテゴリ: {selectedGameName || selectedGameId}
            <button
              type="button"
              onClick={clearGameFilter}
              className={styles.clearFilterButton}
              aria-label="カテゴリ絞り込みを解除"
              title="カテゴリ絞り込みを解除"
            >
              ×
            </button>
          </span>
        )}
      </h1>

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
            <div key={stream.user} className={styles.card}>
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
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder-thumb.png";
                  }}
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
                  <strong>視聴者数:</strong>{" "}
                  {Number(stream.viewers).toLocaleString()}
                </p>
                <p className={styles.text}>
                  <strong>配信時間:</strong> {stream.duration || "不明"}
                </p>
                <p className={styles.text}>
                  <strong>タグ:</strong>{" "}
                  {stream.tags?.length > 0 ? stream.tags.join(", ") : "なし"}
                </p>
                <p className={styles.text}>
                  <strong>カテゴリ:</strong>{" "}
                  {stream.gameName && stream.gameName.trim() !== "" ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleClickCategory(stream.gameId, stream.gameName)
                      }
                      className={`${styles.categoryPill} ${styles.categoryButton}`}
                      title={stream.gameId || ""}
                      aria-pressed={selectedGameId === stream.gameId}
                    >
                      {stream.gameName}
                    </button>
                  ) : (
                    "未設定"
                  )}
                </p>

                <button
                  onClick={() => toggleFavorite(stream, index)}
                  className={`${styles.button} ${styles.favoriteButton} ${
                    isFavorite(stream.user) ? styles.fav : styles.notFav
                  }`}
                  aria-pressed={isFavorite(stream.user)}
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
