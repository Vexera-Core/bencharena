import { Footer } from "../components/landing/Footer";
import { Header } from "../components/landing/Header";
import { Hero } from "../components/landing/Hero";
import { InfrastructureConsole } from "../components/landing/InfrastructureConsole";
import { LeaderboardPreview } from "../components/landing/LeaderboardPreview";
import { PlayerCardPreview } from "../components/landing/PlayerCardPreview";
import { ProtocolLoop } from "../components/landing/ProtocolLoop";
import { TrialFeedback } from "../components/landing/TrialFeedback";

export default function HomePage() {
  return (
    <>
      <a className="skipLink" href="#main-content">
        Skip to content
      </a>

      <main className="shell" id="main-content">
        <Header />
        <Hero />
        <ProtocolLoop />
        <TrialFeedback />
        <InfrastructureConsole />
        <section className="panel showcasePanel" id="leaderboard" aria-labelledby="player-card-title">
          <div className="sectionHeader">
            <div>
              <p className="sectionKicker">Player card preview</p>
              <h2 id="player-card-title">Reputation that evolves with verified work</h2>
            </div>
            <p className="sectionNote">Mock card metadata. Future on-chain proof is not implemented.</p>
          </div>
          <div className="showcaseGrid">
            <PlayerCardPreview />
            <LeaderboardPreview />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
