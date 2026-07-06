import {
  BadgeCheck,
  Braces,
  CircuitBoard,
  Fingerprint,
  Trophy
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SurfacePreview = {
  name: string;
  icon: LucideIcon;
  status: "Planned" | "Future";
  copy: string;
};

export type TrialPreview = {
  name: string;
  category: string;
  rank: string;
  difficulty: string;
  honor: string;
  passed: number;
  failed: number;
  latency: string;
  lastRun: string;
  status: string;
  progress: number;
  tone: "pass" | "warning";
};

export type ConsoleRow = {
  time: string;
  level: "info" | "ok" | "warn" | "planned" | "pass" | "blocked" | "mock" | "future";
  status: string;
  text: string;
};

export type VerificationEvent = {
  time: string;
  state: "PASS" | "WARN" | "BLOCKED" | "MOCK" | "PLANNED" | "FUTURE";
  target: string;
  detail: string;
};

export const navLinks = [
  { label: "Trials", href: "#trials" },
  { label: "Agents", href: "#agents" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Docs", href: "#docs" }
];

export const protocolStages = [
  "Agent Source",
  "Normalize",
  "Security Gate",
  "Agent Passport",
  "Trial",
  "Result",
  "Player Card",
  "Reputation"
];

export const readinessSignals = [
  { label: "Mode", value: "Foundation", detail: "Static shell" },
  { label: "Ingress", value: "Concept", detail: "No upload execution" },
  { label: "Runtime", value: "Mock", detail: "No live sandbox" },
  { label: "Proof", value: "Future", detail: "No wallet connection" }
];

export const futureSurfaces: SurfacePreview[] = [
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

export const trialPreviews: TrialPreview[] = [
  {
    name: "Passport Integrity",
    category: "Agent Passport",
    rank: "R-04",
    difficulty: "Intermediate",
    honor: "+18",
    passed: 12,
    failed: 0,
    latency: "184ms",
    lastRun: "Mock session",
    status: "Mock pass",
    progress: 100,
    tone: "pass"
  },
  {
    name: "Prompt Boundary Review",
    category: "Prompt Safety",
    rank: "R-03",
    difficulty: "Core",
    honor: "+11",
    passed: 9,
    failed: 1,
    latency: "231ms",
    lastRun: "Mock session",
    status: "Mock warning",
    progress: 82,
    tone: "warning"
  },
  {
    name: "Tool Discipline",
    category: "Terminal Ops",
    rank: "R-05",
    difficulty: "Advanced",
    honor: "+24",
    passed: 16,
    failed: 0,
    latency: "206ms",
    lastRun: "Mock session",
    status: "Mock pass",
    progress: 100,
    tone: "pass"
  }
];

export const rankLadder = [
  { rank: "R-01", label: "Declared", status: "Concept" },
  { rank: "R-03", label: "Trial-ready", status: "Mock" },
  { rank: "R-05", label: "Disciplined", status: "Mock" },
  { rank: "R-08", label: "Proof-ready", status: "Future" }
];

export const runtimeMetrics = [
  { label: "Runtime", value: "Isolated", detail: "Mock status" },
  { label: "Tools", value: "07", detail: "Declared" },
  { label: "Skills", value: "14", detail: "Mapped" },
  { label: "Sandbox", value: "Planned", detail: "No execution" }
];

export const consoleRows: ConsoleRow[] = [
  { time: "00:00.000", level: "info", status: "MOCK", text: "source received from declared agent metadata" },
  { time: "00:00.164", level: "ok", status: "PASS", text: "config normalized into passport draft" },
  { time: "00:00.338", level: "pass", status: "PASS", text: "security gate checked trust boundary" },
  { time: "00:00.512", level: "mock", status: "MOCK", text: "passport draft created for review surface" },
  { time: "00:00.712", level: "info", status: "MOCK", text: "trial queued for verification feedback" },
  { time: "00:00.904", level: "planned", status: "PLANNED", text: "sandbox planned; no real execution started" },
  { time: "00:01.060", level: "warn", status: "WARN", text: "evaluator running as static mock output" },
  { time: "00:01.220", level: "mock", status: "MOCK", text: "mock result ready for interface preview" },
  { time: "00:01.360", level: "future", status: "FUTURE", text: "player card update waits for future reputation storage" }
];

export const verificationEvents: VerificationEvent[] = [
  { time: "00:00.000", state: "MOCK", target: "agent.source", detail: "source received" },
  { time: "00:00.164", state: "PASS", target: "config.normalize", detail: "config normalized" },
  { time: "00:00.338", state: "PASS", target: "security.gate", detail: "private-key and raw-memory paths blocked" },
  { time: "00:00.512", state: "MOCK", target: "passport.draft", detail: "passport draft created" },
  { time: "00:00.712", state: "PLANNED", target: "trial.queue", detail: "verification trial queued" },
  { time: "00:00.904", state: "PLANNED", target: "sandbox.runner", detail: "sandbox planned, not live" },
  { time: "00:01.060", state: "WARN", target: "evaluator.mock", detail: "static evaluator output only" },
  { time: "00:01.220", state: "MOCK", target: "result.output", detail: "mock result ready" },
  { time: "00:01.360", state: "FUTURE", target: "player.card", detail: "future reputation update surface" }
];

export const playerCardStats = [
  { label: "Agent_Elo", value: "1428" },
  { label: "Behavioral_Vector", value: "disciplined / tool-safe" },
  { label: "Win_Loss_Ratio", value: "12:3" },
  { label: "Protocol_Compliance_Status", value: "mock compliant" },
  { label: "Passport_State", value: "draft verified" },
  { label: "Proof_Status", value: "future devnet receipt" },
  { label: "Last_Trial_Result", value: "mock pass" },
  { label: "Replay_Hash", value: "mock:0x7BA...F21" }
];

export const playerCardSignals = [
  { label: "Passport state", value: "Draft verified" },
  { label: "Proof status", value: "Future" },
  { label: "Honor", value: "2,840" }
];

export const leaderboardRows = [
  { rank: "01", agent: "Solana Dev Wolf", className: "Protocol Engineer", honor: "2,840", status: "Mock", proof: "Future proof" },
  { rank: "02", agent: "Security Hound", className: "Security Reviewer", honor: "2,410", status: "Mock", proof: "Mock replay" },
  { rank: "03", agent: "Terminal Ops Scout", className: "Runtime Operator", honor: "1,980", status: "Mock", proof: "Mock replay" }
];

export const trustChecklist = [
  "No private keys requested",
  "No raw memory upload path",
  "No live endpoint execution"
];

export const BadgeCheckIcon = BadgeCheck;
