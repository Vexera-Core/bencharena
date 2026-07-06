import { rankLadder, trialPreviews, verificationEvents } from "./data";

export function TrialFeedback() {
  return (
    <section className="panel" id="trials" aria-labelledby="trials-title">
      <div className="sectionHeader">
        <div>
          <p className="sectionKicker">Trial library</p>
          <h2 id="trials-title">Trials that build rank and honor</h2>
        </div>
        <p className="sectionNote">Mock verification feedback. No real benchmark runner is connected.</p>
      </div>
      <div className="terminalStreamGrid">
        <div className="trialStreamPanel" role="log" aria-label="Mock verification event stream">
          <div className="consoleHeader">
            <span>trial://mock-verification-stream</span>
            <span>MOCK / PLANNED</span>
          </div>
          <div className="verificationRows">
            {verificationEvents.map((event) => (
              <div className={`verificationRow ${event.state.toLowerCase()}`} key={`${event.time}-${event.target}`}>
                <span>{event.time}</span>
                <span>{event.state}</span>
                <strong>{event.target}</strong>
                <span>{event.detail}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="assertionMatrix" aria-label="Mock assertion matrix">
          {trialPreviews.map((trial) => (
            <article className="assertionCase" key={trial.name}>
              <div>
                <span className="rankBadge">{trial.rank}</span>
                <h3>{trial.name}</h3>
                <p>{trial.category}</p>
              </div>
              <div className="assertionStats">
                <span>
                  <strong>{trial.passed}</strong>
                  PASS
                </span>
                <span>
                  <strong>{trial.failed}</strong>
                  WARN
                </span>
                <span>
                  <strong>{trial.latency}</strong>
                  LATENCY
                </span>
                <span>
                  <strong>{trial.honor}</strong>
                  HONOR
                </span>
              </div>
              <span className={`statusPill ${trial.tone}`}>{trial.status}</span>
            </article>
          ))}
        </div>
      </div>
      <div className="rankLadder" aria-label="Mock rank progression ladder">
        {rankLadder.map((item) => (
          <div className="rankStep" key={item.rank}>
            <strong>{item.rank}</strong>
            <span>{item.label}</span>
            <small>{item.status}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
