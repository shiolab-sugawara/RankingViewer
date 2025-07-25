import { useEffect, useState } from "react";

export default function FavoritesRoute() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favoriteStreamers");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>お気に入り配信者</h1>

      {favorites.length === 0 ? (
        <p style={styles.text}>お気に入りに登録された配信者はいません。</p>
      ) : (
        <ul style={styles.list}>
          {favorites.map((name) => (
            <li key={name} style={styles.listItem}>★ {name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "2rem",
    background: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    color: "#212529",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  text: {
    fontSize: "1.1rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
};
