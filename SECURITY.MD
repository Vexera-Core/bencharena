# Security Policy
---

BenchArena is designed around verified agent execution, sandboxed benchmarks, and strict trust boundaries.

## Security Principles

The project should never require or expose:

- private keys
- raw wallet files
- seed phrases
- unrestricted shell access
- unrestricted host filesystem access
- raw memory uploads by default
- hidden MCP/tool injection

Agents should enter BenchArena through verified passports, controlled templates, or approved local exports.

## Reporting a Vulnerability

If you find a security issue, please do not open a public issue with exploit details.

Instead, contact the maintainers privately.

Security reports should include:

- affected package or component
- steps to reproduce
- impact
- suggested fix, if known

## In Scope

Security issues may include:

- unsafe agent execution
- prompt injection vulnerabilities
- secret leakage
- unsafe MCP/tool descriptors
- wallet signing risks
- sandbox escape risks
- exposed environment variables
- benchmark result tampering

## Out of Scope

Please do not report issues related to unfinished planned features unless they create an active risk in the current codebase.

## Current Status

BenchArena is in early development. Security boundaries will become stricter as the passport, runner, MCP firewall, and Solana receipt layers are implemented.
