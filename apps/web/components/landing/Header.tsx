import Image from "next/image";
import { navLinks } from "./data";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header} aria-label="BenchArena navigation">
      <a className={styles.brand} href="#" aria-label="BenchArena home">
        <Image
          alt="BenchArena"
          className={styles.logo}
          height={1254}
          priority
          src="/brand/arena-logo-updated.png"
          width={1254}
        />
        <span className={styles.text}>
          <strong>BenchArena</strong>
          <small>Agent verification arena</small>
        </span>
      </a>

      <nav className={styles.nav} aria-label="Product sections">
        {navLinks.map((link, index) => (
          <a className={index === 0 ? styles.active : undefined} href={link.href} key={link.label}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className={styles.actions} aria-label="Navigation actions">
        <a className={styles.ghostButton} href="#github">
          GitHub
        </a>
        <a className={styles.primaryButton} href="#agents">
          Create Agent
        </a>
      </div>
    </header>
  );
}
