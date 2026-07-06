# BenchArena Security Policy

> **Security posture:** verification-first, sandbox-minded, and explicit about trust boundaries.

BenchArena is an early-stage protocol/product for proving autonomous AI agents. Security documentation should stay honest: some boundaries are implemented as protocol concepts today, while runners, wallets, MCP connections, databases, and proof rails remain planned or future work unless code says otherwise.

---

## Core Safety Line

> [!IMPORTANT]
> No hidden injection. No raw memory upload. No private keys.

BenchArena should never require users or agents to provide custody secrets, raw wallet material, unrestricted memory dumps, or hidden tool access in order to participate.

---

## Current Security Status

| Area | Current Status | Notes |
|---|---|---|
| Agent Passport types | Protocol foundation | Defines identity, class, policy, and verification vocabulary |
| Security Gate | Core trust concept | Intended to block unsafe permissions before trial eligibility |
| Web app | Static / mock surface | No real uploads, endpoints, wallets, or sandbox execution |
| Benchmark runner | Mock / planned | No live execution path should be implied |
| MCP integration | Planned | No real MCP firewall or live agent connection yet |
| Solana receipts | Future | No wallet connect, signing, custody, or minting flow |
| x402 compute | Future | No payment or compute budget rail implemented |
| Database records | Planned | No persistent passport/result store yet |

---

## Security Principles

BenchArena should remain:

- **Passport-first:** agent claims become structured protocol data before trust decisions.
- **Sandbox-minded:** execution is a trust boundary, not a default assumption.
- **Permission-explicit:** tools, memory, filesystem, and shell access must be visible.
- **Secrets-hostile:** private keys, seed phrases, wallet files, and `.env` secrets do not belong in submissions.
- **Mock-honest:** demos and fixtures must stay labeled as mock, planned, or future.
- **Proof-ready:** future receipts may anchor hashes or results, but must not require custody secrets.

---

## Prohibited Inputs

Do not submit, request, store, or commit:

| Never Provide | Why |
|---|---|
| Private keys or seed phrases | Direct custody risk |
| Raw wallet files | Account takeover risk |
| `.env` files or API secrets | Credential leakage |
| Raw agent memory dumps | Sensitive data and prompt-injection risk |
| Hidden tool descriptors | Undisclosed permission escalation |
| Unrestricted shell or filesystem access | Host compromise risk |

---

## Reporting a Vulnerability

> [!WARNING]
> Do not open a public issue with exploit details, secrets, proof-of-exploit payloads, or private environment data.

Please report security issues privately to the maintainers.

Include:

- Affected package, document, workflow, or component.
- Reproduction steps.
- Expected vs. actual behavior.
- Security impact.
- Suggested fix, if known.
- Whether secrets, wallets, memory, or agent execution are involved.

Use clear language and avoid sharing unnecessary sensitive material.

---

## In Scope

Security issues may include:

- Unsafe agent execution paths.
- Prompt injection or hidden tool injection.
- Secret leakage.
- Unsafe MCP or tool descriptors.
- Wallet signing, custody, or private-key risks.
- Sandbox escape risks.
- Exposed environment variables.
- Benchmark result tampering.
- Claims that make planned/future systems look live.

---

## Out of Scope

Please do not report unfinished planned features unless they create an active risk in the current codebase.

Examples generally out of scope:

- "MCP is not implemented yet" when no MCP code path exists.
- "Solana receipts are not live yet" when documentation labels them future.
- "Database persistence is missing" while the project is still foundation mode.

---

## Trust Boundary Checklist

Before adding security-sensitive behavior, ask:

| Question | Required Answer |
|---|---|
| Does this cross execution, memory, tool, wallet, or filesystem boundaries? | The boundary is documented |
| Can a user mistake mock output for verified reputation? | Mock/future labels are visible |
| Does this require secrets, private keys, wallet files, or raw memory? | The design is rejected or redesigned |
| Can unverified output improve rank, honor, or reputation? | No |
| Is the permission visible in the Agent Passport? | Yes |
| Can future results be replayed or audited? | Planned before production claims |

---

## Security Vocabulary

| Term | Meaning |
|---|---|
| `draft` | Recorded but not reviewed |
| `needs-review` | Requires manual or automated review |
| `blocked` | Not eligible under current trust rules |
| `verified` | Passed checks for a specific scope only |

> [!NOTE]
> `verified` should never mean universally safe. It means verified for the current protocol scope.

---

## Maintainer Expectations

Maintainers should:

- Keep commits small and reviewable.
- Reject fake on-chain, sandbox, wallet, database, or runner claims.
- Require clear planned/future/mock labels for unfinished infrastructure.
- Treat dependency additions as security-relevant.
- Keep CI checks green before merging code changes.
