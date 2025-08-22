import { useEffect, useState } from "react";
import { subDays, format } from "date-fns";

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
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
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

  const styles = darkMode ? darkStyles : lightStyles;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{dateStr} の配信ランキング</h1>

      <div style={styles.buttonGroup}>
        <button
          onClick={goToday}
          style={{ ...styles.button, opacity: daysAgo === 0 ? 0.5 : 1 }}
          disabled={daysAgo === 0}
        >
          今日
        </button>

        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
          <button
            key={day}
            onClick={() => setDaysAgo(day)}
            style={{
              ...styles.button,
              opacity: daysAgo === day ? 0.5 : 1,
            }}
            disabled={daysAgo === day}
          >
            {day}日前
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.text}>読み込み中...</p>
      ) : (
        <div style={styles.cardGrid}>
          {ranking.map((stream, index) => (
            <div key={index} style={styles.card}>
              <img
                src={stream.thumbnail}
                alt={`${stream.user} thumbnail`}
                style={styles.thumbnail}
              />
              <div>
                <h2 style={styles.cardTitle}>
                  #{index + 1} {stream.user}
                </h2>
                <p style={styles.text}>
                  <strong>視聴者数:</strong> {stream.viewers}
                </p>
                <p style={styles.text}>
                  <strong>配信時間:</strong> {stream.duration || "不明"}
                </p>
                <p style={styles.text}>
                  <strong>タグ:</strong>{" "}
                  {stream.tags.length > 0 ? stream.tags.join(", ") : "なし"}
                </p>

                <button
                  onClick={() => toggleFavorite(stream.user)}
                  style={{
                    ...styles.button,
                    backgroundColor: isFavorite(stream.user)
                      ? "#ffc107"
                      : "#6c757d",
                    marginTop: "0.5rem",
                  }}
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

const lightStyles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "2rem",
    background: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    color: "#212529",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonGroup: {
    marginBottom: "2rem",
    display: "flex",
    gap: "0.5rem",
    justifyContent: "center",
    flexWrap: "nowrap",
    overflowX: "auto",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  cardGrid: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    maxWidth: "700px",
    width: "100%",
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  thumbnail: {
    width: "280px",
    height: "158px",
    borderRadius: "4px",
    objectFit: "cover",
    flexShrink: 0,
  },
  text: {
    color: "#212529",
    marginBottom: "0.5rem",
  },
};

const darkStyles: typeof lightStyles = {
  ...lightStyles,
  container: {
    ...lightStyles.container,
    background: "#121212",
    color: "#f1f1f1",
  },
  card: {
    ...lightStyles.card,
    background: "#1e1e1e",
    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.05)",
  },
  button: {
    ...lightStyles.button,
    backgroundColor: "#339af0",
    color: "#fff",
  },
  text: {
    color: "#f1f1f1",
    marginBottom: "0.5rem",
  },
};
