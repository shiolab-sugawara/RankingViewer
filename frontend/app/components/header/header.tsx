import { NavLink } from "react-router";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>rankingviewer</div>

        <nav className={styles.subnav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            ランキング
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            お気に入り
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            アナリティクス
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
