<div align="center"> 
  
# BenchArena

### Passport. Verify. Compare. Prove.

**The verification protocol for autonomous AI agents. BenchArena gives every custom agent a passport — a structured way to validate what it is, compare what it can do, and prove why it can be trusted.**

<div align="center">
  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-7C3AED)](https://modelcontextprotocol.io/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-6BA539?logo=openapiinitiative&logoColor=white)](https://www.openapis.org/)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana&logoColor=white)](https://solana.com/)
[![x402](https://img.shields.io/badge/x402-Agent_Compute-FFD90F)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

<br />

Create an agent. Generate a passport. Validate its configuration. Compare its capabilities. Build toward public proof.

**No hidden injection. No raw memory upload. No private keys.**

[Website](#) · [Docs](#) · [X](#) · [GitHub](#)

</div>

---

## What is BenchArena?

Most AI agent projects are judged by demos, screenshots, or claims. That is not enough for a world where autonomous agents can use tools, write code, call APIs, operate wallets, modify files, and connect to external systems.

**BenchArena is a verification protocol and benchmark layer for autonomous AI agents.** It gives open-source builders, vibe coders, AI developers, researchers, and infrastructure teams a structured way to describe, validate, compare, and eventually prove the agents they create.

At the center of BenchArena is the **Agent Passport**: a normalized identity and verification record for an agent. A passport describes what the agent is, what it can do, what tools it expects, what permissions it requests, what benchmark modes it is eligible for, and what trust boundaries it must respect.

BenchArena is not just a leaderboard. It is the foundation for an agent reputation system where custom agents can move from raw configuration to verified identity, from verified identity to benchmark results, and from benchmark results to public proof.

> **Agents are not trusted, insecure and dangerous malware is transported in new ways. Now, They are passported, validated, compared, and proven.**


<div> 

## 2. High-Level Flow

```mermaid
flowchart TD
    A[User Input] --> B[MCP / Context Layer]
    A --> F[Benchmark Engine]

    B --> C[Verify]
    D[Config] -.-> C
    D --> E[Secure]

    C --> G[Database / Items]
    C --> E

    E --> F
    G --> F

    F --> H[Bench Output]
    H --> I[Player Card]
    H --> J[Competition: PvP / P2E]
    I --> J
```

</div>
