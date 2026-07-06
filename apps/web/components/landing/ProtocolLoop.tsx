import { BadgeCheck, Gauge, ShieldCheck } from "lucide-react";
import { futureSurfaces, protocolStages } from "./data";

export function ProtocolLoop() {
  return (
    <>
      <section className="panel protocolPanel" aria-labelledby="loop-title">
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

      <section className="calloutGrid" aria-label="Protocol notes">
        <div className="protocolAlert note">
          <strong>NOTE</strong>
          <p>This stream is simulated until the sandbox runner is implemented.</p>
        </div>
        <div className="protocolAlert important">
          <strong>IMPORTANT</strong>
          <p>BenchArena does not connect blindly to private live agents.</p>
        </div>
        <div className="protocolAlert warning">
          <strong>WARNING</strong>
          <p>On-chain player-card mutation is planned for devnet later and is not live yet.</p>
        </div>
      </section>

      <section className="panel" id="agents" aria-labelledby="surfaces-title">
        <div className="sectionHeader">
          <p className="sectionKicker">Future surfaces</p>
          <h2 id="surfaces-title">The first arena map</h2>
        </div>
        <div className="surfaceGrid">
          {futureSurfaces.map((surface) => {
            const SurfaceIcon = surface.icon;

            return (
              <article className="surfaceCard" key={surface.name}>
                <div className="cardTopline">
                  <SurfaceIcon className="surfaceIcon" size={24} aria-hidden="true" />
                  <h3>{surface.name}</h3>
                  <span>
                    <BadgeCheck size={13} aria-hidden="true" />
                    {surface.status}
                  </span>
                </div>
                <p>{surface.copy}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
