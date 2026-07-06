# Contributing to BenchArena

Thanks for your interest in contributing to BenchArena.

BenchArena is an early-stage verification protocol for autonomous AI agents. The project focuses on agent passports, sandboxed benchmark execution, replayable results, player cards, and future proof or reward layers.

## Current Stage

This repository is in **foundation mode**. Contributions should stay small, clear, and easy to review.

> [!NOTE]
> Honest status labels matter. Mark unfinished systems as **planned**, **future**, or **mock** instead of implying they are live.

Good first contributions include:

- Documentation cleanup.
- Schema definitions.
- Mock/demo fixtures.
- Test fixtures.
- Issue reports.
- Architecture notes.
- Small protocol utilities.

## Contributor Flow

1. Pick one small change.
2. Create a focused branch.
3. Make the smallest useful commit.
4. Run checks before opening a PR when scripts exist.
5. Explain what changed, why it matters, and what remains planned.

## Commit Style

Use numbered commit messages so the project history stays easy to scan.

```txt
<commit-name>--short-description
049--polish-architecture-doc
050--polish-contributing-doc
```

Keep the number moving forward. Use lowercase, hyphenated summaries, and prefer one focused change per commit.

## Pull Request Expectations

Before opening a pull request, make sure the PR is easy to review:

- Keep commits small and related.
- Describe the user-facing or protocol-facing change.
- Mention whether the work is current, planned, future, or mock.
- Run `pnpm check` or the relevant package scripts when code changes.
- Include screenshots for visual web changes when practical.

## Safety Rules

> [!IMPORTANT]
> Do not commit secrets, private keys, `.env` files, seed phrases, wallet files, raw memory exports, or private agent credentials.

Agent, security, and Web3 work must keep these boundaries intact:

- No hidden injection.
- No raw memory upload.
- No private keys.
- No unsafe tool access.
- No fake on-chain claims.
- No unrestricted live agent execution.
- No production claims for mock benchmark output.

## Project Principles

BenchArena should remain:

- **Passport-first.**
- **Sandboxed by default.**
- **No hidden injection.**
- **No raw memory upload.**
- **No private keys.**
- **Proof-ready, not proof-pretending.**
- **Developer-friendly.**

## Pull Requests

Pull requests are welcome. Major architecture, security, or protocol changes should be discussed in an issue first.

> [!WARNING]
> Do not add backend, Solana, MCP, x402, wallet, database, or sandbox execution logic unless the issue or PR explicitly scopes that work and the trust boundary is documented.

## License

By contributing, you agree that your contributions will be licensed under the repository license.
