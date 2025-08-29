import { useEffect, useState } from "react";
import styles from "./route.module.css";

export default function FavoritesRoute() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

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

  const removeFavorite = (name: string) => {
    const updated = favorites.filter((n) => n !== name);
    setFavorites(updated);
    localStorage.setItem("favoriteStreamers", JSON.stringify(updated));
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      <h1 className={styles.heading}>お気に入り配信者</h1>

      {favorites.length === 0 ? (
        <p className={styles.text}>お気に入りに登録された配信者はいません。</p>
      ) : (
        <div className={styles.cardGrid}>
          {favorites.map((name) => (
            <div key={name} className={styles.card}>
              <div>
                <h2 className={styles.cardTitle}>★ {name}</h2>
                <button
                  onClick={() => removeFavorite(name)}
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
