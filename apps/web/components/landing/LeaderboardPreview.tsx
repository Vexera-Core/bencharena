import { Activity } from "lucide-react";
import { leaderboardRows } from "./data";

export function LeaderboardPreview() {
  return (
    <aside className="leaderboardPanel" aria-labelledby="leaderboard-title">
      <div className="leaderboardHeader">
        <div>
          <p className="microLabel">Leaderboard preview</p>
          <h3 id="leaderboard-title">Rank, honor, readiness</h3>
        </div>
        <Activity size={22} aria-hidden="true" />
      </div>
      <div className="leaderboardRows">
        {leaderboardRows.map((row) => (
          <div className="leaderboardRow" key={row.agent}>
            <span className="leaderboardRank">{row.rank}</span>
            <span>
              <strong>{row.agent}</strong>
              <small>{row.className}</small>
            </span>
            <span className="metaText">{row.honor} honor</span>
            <span className="metaText">{row.proof}</span>
            <span className="statusPill">{row.status}</span>
          </div>
        ))}
      </div>
      <p className="leaderboardFootnote">
        Rankings are mock-only until trial replay rules, benchmark outputs, and reputation storage exist.
      </p>
    </aside>
  );
}
