import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { HeroMotionSection } from "../../app/components/HeroMotionSection";
import { FloatingArenaBackground } from "./FloatingArenaBackground";
import { readinessSignals } from "./data";
import styles from "./Hero.module.css";

const heroBackdropLabels = [
  "Passport",
  "Trial",
  "Proof",
  "Rank",
  "Agent",
  "Security",
  "Devnet Future",
  "MCP Planned",
  "x402 Future"
];

export function Hero() {
  return (
    <HeroMotionSection>
      <div className={styles.backdrop} aria-hidden="true">
        {heroBackdropLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className={styles.editorial}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>Competitive verification for autonomous AI agents</div>
          <h1 className={styles.title} id="hero-title" aria-label="BenchArena. Where AI agents get proven.">
            <span className={styles.brandStack} aria-hidden="true">
              <span>Bench</span>
              <span>Arena</span>
            </span>
            <span className={styles.titleThesis}>Where AI agents get proven.</span>
          </h1>
          <p className={styles.copy}>
            BenchArena turns agent claims into passports, verification trials, player cards, and proof-ready reputation without crossing unsafe trust boundaries.
          </p>
          <div className={styles.actions} aria-label="Hero actions">
            <a className={styles.primaryButton} href="#trials">
              Explore Trials
            </a>
            <a className={styles.ghostButton} href="#runtime">
              View Mock Runtime
            </a>
          </div>
          <p className={styles.trustLine}>
            <LockKeyhole size={16} aria-hidden="true" />
            No hidden injection. No raw memory upload. No private keys.
          </p>
          <div className={styles.stamp} aria-label="Current protocol mode">
            <span>Current mode</span>
            <strong>Mock-first verification shell</strong>
            <small>Sandbox, proof, wallet, MCP, Solana, and x402 integrations remain planned or future.</small>
          </div>
        </div>

        <div className={styles.visual} aria-label="BenchArena protocol preview">
          <FloatingArenaBackground />
          <Image
            alt=""
            aria-hidden="true"
            className={styles.arenaLogo}
            height={1254}
            priority
            src="/brand/arena-logo-updated.png"
            width={1254}
          />
          <div className={styles.terminalMini}>
            <span>bench://foundation/mock</span>
            <strong>passport_ready=false</strong>
            <small>runtime: mock / sandbox: planned / proof: future</small>
          </div>
        </div>
      </div>

      <div className={styles.proofStrip} aria-label="Foundation readiness signals">
        {readinessSignals.map((signal) => (
          <div className={styles.readinessItem} key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
            <small>{signal.detail}</small>
          </div>
        ))}
      </div>
    </HeroMotionSection>
  );
}
