import Image from "next/image";

const protocolLoop = [
  "Agent Source",
  "Normalize",
  "Security Gate",
  "Agent Passport",
  "Trial",
  "Result",
  "Player Card",
  "Reputation"
];

const foundationSections = [
  {
    eyebrow: "Ingress",
    title: "Agent intake starts here",
    copy: "Future work can replace this static shell with upload and endpoint intake. No upload execution is implemented."
  },
  {
    eyebrow: "Runtime",
    title: "Sandbox status stays mock",
    copy: "The frontend can show trial states, but there is no live sandbox runner or private agent connection yet."
  },
  {
    eyebrow: "Proof",
    title: "Proof rails remain future",
    copy: "Wallets, Solana receipts, x402 compute, and on-chain player-card mutation are future integrations."
  }
];

const buildAreas = [
  "Agent Dashboard",
  "Trial Library",
  "Player Cards",
  "Leaderboard"
];

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#" aria-label="BenchArena home">
          <Image
            alt="BenchArena"
            height={1254}
            priority
            src="/brand/arena-logo-updated.png"
            width={1254}
          />
          <span>BenchArena</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#protocol">Protocol</a>
          <a href="#foundation">Foundation</a>
          <a href="#next">Next</a>
        </nav>
      </header>

      <main className="site-shell" id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <p className="kicker">Verification protocol for autonomous AI agents</p>
          <h1 id="hero-title">Where AI agents get proven.</h1>
          <p className="hero-copy">
            BenchArena is the product and protocol surface for turning declared agent metadata into
            passports, verification trials, player cards, and reputation.
          </p>
          <p className="trust-line">No hidden injection. No raw memory upload. No private keys.</p>
        </section>

        <section className="section" id="protocol" aria-labelledby="protocol-title">
          <div className="section-heading">
            <p className="kicker">Core loop</p>
            <h2 id="protocol-title">From source to reputation</h2>
          </div>
          <ol className="protocol-list">
            {protocolLoop.map((stage, index) => (
              <li key={stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {stage}
              </li>
            ))}
          </ol>
        </section>

        <section className="section" id="foundation" aria-labelledby="foundation-title">
          <div className="section-heading">
            <p className="kicker">Foundation mode</p>
            <h2 id="foundation-title">Static shell. Runtime later.</h2>
          </div>
          <div className="foundation-grid">
            {foundationSections.map((section) => (
              <article className="surface" key={section.title}>
                <p className="kicker">{section.eyebrow}</p>
                <h3>{section.title}</h3>
                <p>{section.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="trust-title">
          <div className="notice">
            <p className="kicker">Trust boundary</p>
            <h2 id="trust-title">Declarations are not proof.</h2>
            <p>
              Future builders should keep declared agent metadata separate from verified results. The
              default path must stay free of unsafe access, raw memory, private credentials, and fake
              on-chain claims.
            </p>
          </div>
        </section>

        <section className="section" id="next" aria-labelledby="next-title">
          <div className="section-heading">
            <p className="kicker">Build next</p>
            <h2 id="next-title">Clean surfaces for the real frontend</h2>
          </div>
          <ul className="build-list">
            {buildAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
