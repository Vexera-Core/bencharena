import { consoleRows, runtimeMetrics } from "./data";

export function InfrastructureConsole() {
  return (
    <section className="panel" id="runtime" aria-labelledby="runtime-title">
      <div className="sectionHeader">
        <div>
          <p className="sectionKicker">Runtime status</p>
          <h2 id="runtime-title">Infrastructure console for agent verification</h2>
        </div>
        <p className="sectionNote">Mock lifecycle view. No SSE, WebSocket, endpoint connection, or sandbox execution.</p>
      </div>
      <div className="metricsGrid">
        {runtimeMetrics.map((metric) => (
          <div className="metricCard" key={metric.label}>
            <span className="microLabel">{metric.label}</span>
            <strong>{metric.value}</strong>
            <span className="metaText">{metric.detail}</span>
          </div>
        ))}
      </div>
      <div className="consolePanel" role="log" aria-label="Mock agent runtime console">
        <div className="consoleHeader">
          <span>agent-ready://bench-arena/mock-lifecycle</span>
          <span>Mock / Planned</span>
        </div>
        <div className="consoleRows">
          {consoleRows.map((row) => (
            <div className={`consoleRow ${row.level}`} key={`${row.time}-${row.text}`}>
              <span>{row.time}</span>
              <span>{row.level}</span>
              <span>{row.status}</span>
              <span>{row.text}</span>
            </div>
          ))}
        </div>
        <div className="consoleFooter">
          <span>No private keys</span>
          <span>No raw memory</span>
          <span>No live execution</span>
        </div>
      </div>
    </section>
  );
}
