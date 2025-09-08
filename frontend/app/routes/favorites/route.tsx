// favorites route
import { useEffect, useState } from "react";
import styles from "./route.module.css";

type FavoriteItem = {
  user: string;
  viewers: number;
  thumbnail: string;
  duration: string | null;
  tags: string[];
  date: string;
  rank: number;
};
type FavoriteMap = Record<string, FavoriteItem>;

const STORAGE_V2 = "favoriteStreamersV2";

export default function FavoritesRoute() {
  const [favorites, setFavorites] = useState<FavoriteMap>({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_V2);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
  }, []);

  const removeFavorite = (user: string) => {
    setFavorites((prev) => {
      const next = { ...prev };
      delete next[user];
      localStorage.setItem(STORAGE_V2, JSON.stringify(next));
      return next;
    });
  };

  const list = Object.values(favorites);

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <h1 className={styles.heading}>お気に入り配信者</h1>

      {list.length === 0 ? (
        <p className={styles.text}>お気に入りに登録された配信者はいません。</p>
      ) : (
        <div className={styles.cardGrid}>
          {list.map((item) => (
            <div key={item.user} className={styles.card}>
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={`${item.user} thumbnail`}
                  className={styles.thumbnail}
                />
              )}
              <div>
                <h2 className={styles.cardTitle}>
                  ★ {item.user} <span className={styles.subtle}>（{item.date} #{item.rank}）</span>
                </h2>

                <p className={styles.text}>
                  <strong>視聴者数:</strong> {item.viewers.toLocaleString()}
                </p>
                <p className={styles.text}>
                  <strong>配信時間:</strong> {item.duration || "不明"}
                </p>
                <p className={styles.text}>
                  <strong>タグ:</strong>{" "}
                  {item.tags?.length ? item.tags.join(", ") : "なし"}
                </p>

                <button
                  onClick={() => removeFavorite(item.user)}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  登録解除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
