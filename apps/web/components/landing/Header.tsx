import Image from "next/image";
import { navLinks } from "./data";

export function Header() {
  return (
    <header className="topBar" aria-label="BenchArena navigation">
      <a className="brandMark" href="#" aria-label="BenchArena home">
        <Image
          alt="BenchArena"
          className="brandLogo"
          height={1254}
          priority
          src="/brand/arena-logo-updated.png"
          width={1254}
        />
        <span className="brandText">
          <strong>BenchArena</strong>
          <small>Agent verification arena</small>
        </span>
      </a>

      <nav className="primaryNav" aria-label="Product sections">
        {navLinks.map((link, index) => (
          <a className={index === 0 ? "active" : undefined} href={link.href} key={link.label}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="navActions" aria-label="Navigation actions">
        <a className="ghostButton" href="#github">
          GitHub
        </a>
        <a className="primaryButton" href="#agents">
          Create Agent
        </a>
      </div>
    </header>
  );
}
