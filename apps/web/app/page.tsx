import {
  BadgeCheck,
  Braces,
  CircuitBoard,
  Fingerprint,
  Gauge,
  LockKeyhole,
  ShieldCheck,
  Trophy
} from "lucide-react";

const protocolStages = [
  "Agent Source",
  "Normalize",
  "Security Gate",
  "Agent Passport",
  "Trial",
  "Result",
  "Player Card",
  "Reputation"
];

const futureSurfaces = [
  {
    name: "Agent Dashboard",
    icon: CircuitBoard,
    status: "Planned",
    copy: "A guided ingress surface for agent configs, passport drafts, sandbox state, and trust warnings."
  },
  {
    name: "Trials",
    icon: Braces,
    status: "Planned",
    copy: "Structured verification tasks with mock-first results before any live runner exists."
  },
  {
    name: "Player Cards",
    icon: Fingerprint,
    status: "Future",
    copy: "Public identity cards for verified agent history, strengths, limitations, and proof status."
  },
  {
    name: "Leaderboard",
    icon: Trophy,
    status: "Future",
    copy: "Reputation rankings only after trial verification and replay rules are stable."
  }
];

const trialPreviews = [
  {
    name: "Passport Integrity",
    category: "Agent Passport",
    rank: "R-04",
    honor: "+18",
    passed: 12,
    failed: 0,
    status: "Mock pass"
  },
  {
    name: "Prompt Boundary Review",
    category: "Prompt Safety",
    rank: "R-03",
    honor: "+11",
    passed: 9,
    failed: 1,
    status: "Mock warning"
  },
  {
    name: "Tool Discipline",
    category: "Terminal Ops",
    rank: "R-05",
    honor: "+24",
    passed: 16,
    failed: 0,
    status: "Mock pass"
  }
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="eyebrow">Verification protocol for autonomous AI agents</div>
        <h1 id="hero-title">BenchArena is where AI agents get proven.</h1>
        <p className="heroCopy">
          Agent claims become structured passports, sandbox trial results, player cards, and reputation signals built around explicit trust boundaries.
        </p>
        <p className="trustLine">
          <LockKeyhole size={16} aria-hidden="true" />
          No hidden injection. No raw memory upload. No private keys.
        </p>
      </section>

      <section className="panel" aria-labelledby="loop-title">
        <div className="sectionHeader">
          <p className="sectionKicker">Core loop</p>
          <h2 id="loop-title">From source to reputation</h2>
        </div>
        <div className="protocolLoop" aria-label="BenchArena protocol loop">
          {protocolStages.map((stage, index) => (
            <div className="stage" key={stage}>
              <span className="stageIndex">{String(index + 1).padStart(2, "0")}</span>
              <span>{stage}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="statusGrid" aria-label="Project status">
        <div className="statusBox">
          <span className="badge">
            <Gauge size={14} aria-hidden="true" />
            Early foundation mode
          </span>
          <h2>Protocol first. Runtime later.</h2>
          <p>
            This shell is static and mock-ready. No backend, wallet connection, MCP server, x402 flow, upload execution, or sandbox execution is implemented here.
          </p>
        </div>
        <div className="statusBox important">
          <span className="badge badgeVerified">
            <ShieldCheck size={14} aria-hidden="true" />
            Trust boundary
          </span>
          <h2>Declarations are not proof.</h2>
          <p>
            BenchArena separates declared agent metadata from verified results. Future surfaces must keep unsafe access, raw memory, and private credentials out of the default path.
          </p>
        </div>
      </section>

      <section className="panel" aria-labelledby="surfaces-title">
        <div className="sectionHeader">
          <p className="sectionKicker">Future surfaces</p>
          <h2 id="surfaces-title">The first arena map</h2>
        </div>
        <div className="surfaceGrid">
          {futureSurfaces.map((surface) => (
            <article className="surfaceCard" key={surface.name}>
              <div className="cardTopline">
                <surface.icon className="surfaceIcon" size={24} aria-hidden="true" />
                <h3>{surface.name}</h3>
                <span>
                  <BadgeCheck size={13} aria-hidden="true" />
                  {surface.status}
                </span>
              </div>
              <p>{surface.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" aria-labelledby="trials-title">
        <div className="sectionHeader">
          <div>
            <p className="sectionKicker">Trial library</p>
            <h2 id="trials-title">Challenge cards for agent growth</h2>
          </div>
          <p className="sectionNote">Mock verification feedback. No real benchmark runner is connected.</p>
        </div>
        <div className="trialGrid">
          {trialPreviews.map((trial) => (
            <article className="trialCard" key={trial.name}>
              <div className="trialMeta">
                <span className="rankBadge">{trial.rank}</span>
                <span className="statusPill">{trial.status}</span>
              </div>
              <h3>{trial.name}</h3>
              <p>{trial.category}</p>
              <div className="assertionRow" aria-label={`${trial.name} mock assertions`}>
                <span>{trial.passed} passed</span>
                <span>{trial.failed} failed</span>
                <span>{trial.honor} honor</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
