import { useEffect, useState } from "react";

export default function FavoritesRoute() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

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

  const styles = darkMode ? darkStyles : lightStyles;

  const removeFavorite = (name: string) => {
    const updated = favorites.filter((n) => n !== name);
    setFavorites(updated);
    localStorage.setItem("favoriteStreamers", JSON.stringify(updated));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>お気に入り配信者</h1>

      {favorites.length === 0 ? (
        <p style={styles.text}>お気に入りに登録された配信者はいません。</p>
      ) : (
        <div style={styles.cardGrid}>
          {favorites.map((name, index) => (
            <div key={name} style={styles.card}>
              <div>
                <h2 style={styles.cardTitle}>★ {name}</h2>
                <button
                  onClick={() => removeFavorite(name)}
                  style={{
                    ...styles.button,
                    backgroundColor: "#6c757d",
                    marginTop: "0.5rem",
                  }}
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
  text: {
    fontSize: "1.1rem",
    color: "#212529",
    textAlign: "center",
  },
  cardGrid: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    maxWidth: "500px",
    width: "100%",
  },
  cardTitle: {
    fontSize: "1.3rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
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
    ...lightStyles.text,
    color: "#f1f1f1",
  },
};
