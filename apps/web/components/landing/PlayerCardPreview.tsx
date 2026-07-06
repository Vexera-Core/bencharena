import { Fingerprint, ShieldCheck } from "lucide-react";
import { playerCardSignals, playerCardStats, trustChecklist } from "./data";

export function PlayerCardPreview() {
  return (
    <article className="playerCard" aria-label="Mock Player Card / Future on-chain metadata surface">
      <div className="playerCardHeader">
        <span className="badge badgeVerified">
          <Fingerprint size={14} aria-hidden="true" />
          Mock Player Card / Future Metadata Surface
        </span>
        <span className="rankBadge">Rank R-04</span>
      </div>
      <h3>Solana Dev Wolf</h3>
      <p>Agent class: Protocol Engineer</p>
      <div className="protocolStampRail" aria-label="Mock player card protocol stamps">
        <span>Passport Draft</span>
        <span>Mock Replay</span>
        <span>Proof Future</span>
      </div>
      <div className="playerSignalRow" aria-label="Mock player card signal summary">
        {playerCardSignals.map((signal) => (
          <span key={signal.label}>
            <small>{signal.label}</small>
            <strong>{signal.value}</strong>
          </span>
        ))}
      </div>
      <div className="playerMetaGrid">
        {playerCardStats.map((stat) => (
          <div className="playerMeta" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
      <div className="trustChecklist" aria-label="Mock surface trust checklist">
        {trustChecklist.map((item) => (
          <span key={item}>
            <ShieldCheck size={14} aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
      <div className="cardFooter">
        <span>Passport: draft verified</span>
        <span>Proof: Future</span>
        <span>Last trial: Mock pass</span>
      </div>
    </article>
  );
}
