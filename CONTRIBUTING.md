# Contributing to BenchArena

Thanks for your interest in contributing to BenchArena.

BenchArena is an early-stage verification protocol for autonomous AI agents. The project focuses on agent passports, sandboxed benchmark execution, replayable results, player cards, and future proof or reward layers.

## Current Stage

This repository is in foundation mode. Contributions should stay small, clear, and easy to review.

Good first contributions include:

- README improvements
- documentation cleanup
- schema definitions
- mock data
- test fixtures
- issue reports
- architecture notes
- small protocol utilities

## Commit Style

Use numbered commit messages so the project history stays easy to scan.

```txt
019--add-protocol-libraries
020--polish-readme-header
021--define-passport-fixtures
```

Keep the number moving forward. Use lowercase, hyphenated summaries, and prefer one focused change per commit.

## Development Rules

Before opening a pull request:

1. Create a separate branch.
2. Keep the PR small.
3. Explain what changed and why.
4. Run `pnpm check` when code changes.
5. Do not commit secrets, private keys, `.env` files, or wallet files.
6. Do not add unsafe agent execution, wallet signing, or unrestricted tool access.

## Project Principles

BenchArena should remain:

- passport-first
- sandboxed by default
- no hidden injection
- no raw memory upload
- no private keys
- proof-ready
- developer-friendly

## Pull Requests

Pull requests are welcome. Major architecture changes should be discussed in an issue first.

## License

By contributing, you agree that your contributions will be licensed under the repository license.
