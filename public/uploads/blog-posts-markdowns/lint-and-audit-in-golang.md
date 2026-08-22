## Overview

Go's compiler is strict, but it only catches a small slice of what makes code *bad*: unreachable branches, unused imports, obvious type errors. It happily accepts code that leaks goroutines, ignores errors, shadows variables, or deadlocks under load. That gap is exactly where linting and static analysis tools live — and it matters more, not less, now that a growing share of Go code is drafted by an AI agent rather than typed by hand.

This article walks through the toolchain I run on every Go project — from formatting to deep static analysis — and how that same toolchain doubles as the guardrail that keeps AI-generated code honest.

## Why this matters more in the AI era

An AI coding agent can produce a plausible-looking function in seconds. "Plausible" is the problem: the code compiles, the happy path works, and the subtle issues — an unclosed `response.Body`, a goroutine with no exit condition, a mutex locked on one branch and never unlocked on another — slip through unless something *other than a human skim* catches them.

Linters and static analyzers give an agent (and the person reviewing its output) a fast, deterministic feedback loop:

- The agent proposes a change.
- `gofmt`, `go vet`, and `golangci-lint` run against it in seconds.
- Anything flagged goes back to the agent as a concrete, actionable diagnostic — not a vague "please review".

This turns code review from "does this look right?" into "does this pass the same checks every other change has to pass?" — a much cheaper and more reliable question, whether the author is human or not.

## The core toolchain

### 1. `gofmt` / `goimports` — formatting

Non-negotiable baseline. `gofmt` normalizes syntax and layout; `goimports` additionally fixes up import groups and removes unused ones. Neither takes configuration, which is the point — there is nothing to bikeshed.

```bash
gofmt -l .          # list files that aren't formatted
goimports -w .       # rewrite them in place
```

### 2. `go vet` — the built-in safety net

Ships with the Go toolchain and catches real bugs: `Printf` calls with mismatched verbs, struct tags with typos, lock values copied by value, suspicious `nil` comparisons.

```bash
go vet ./...
```

### 3. `golangci-lint` — the meta-linter

Runs dozens of linters in parallel with one config file (`.golangci.yml`), including `staticcheck`, `errcheck`, `ineffassign`, `unused`, `bodyclose`, and `unparam`. This is the single command that belongs in CI and in a pre-commit hook.

```bash
golangci-lint run ./...
```

A minimal config that enables the checks most relevant to AI-assisted code:

```yaml
linters:
  enable:
    - errcheck      # every returned error must be handled
    - govet
    - staticcheck    # deep static analysis, bug-pattern detection
    - ineffassign    # assignments that are never used
    - unused         # dead code
    - bodyclose      # unclosed HTTP response bodies (a classic leak)
    - gocritic
```

### 4. `gocritic` — opinionated diagnostics

Where `golangci-lint`'s bundled linters catch correctness bugs, `gocritic` leans into style and performance: inefficient string concatenation, redundant type conversions, `if`/`else` chains that should be a `switch`, and dozens of other patterns that are "not wrong, but not good." Particularly useful for keeping AI-generated code from accumulating small inefficiencies that compound across a codebase.

### 5. `nilaway` — nil-panic prevention

A newer, Uber-built analyzer that does whole-program nil-flow analysis to flag places where a nil pointer *can* reach a dereference, before it ever ships. Go's `nil` panics are one of the most common runtime failures in production Go services, and they're exactly the kind of thing an AI agent will miss because the nil path only shows up under a condition it didn't consider.

### 6. `govulncheck` — dependency and API vulnerability scanning

Cross-references your code against the Go vulnerability database, but — unlike a naive dependency scanner — only flags a CVE if your code actually calls the vulnerable function. Far fewer false positives, which matters when you're trying to keep a CI gate meaningful instead of noisy.

```bash
govulncheck ./...
```

## Catching what static analysis can't: leaks and deadlocks

Goroutine leaks and deadlocks rarely show up as compile errors or even as lint warnings — they show up as a service that slowly runs out of memory or hangs under load. Two tools close that gap:

- **`go test -race`** — the built-in race detector. Run it in CI on every test suite; it catches concurrent map writes, unsynchronized access, and a large share of the bugs that would otherwise only appear in production.
- **`go.uber.org/goleak`** — a test helper that asserts no goroutines are still running when a test finishes, which is the most reliable way to catch a goroutine leak (a `context` never canceled, a channel nobody closes, a `select` with no exit case) before it reaches a real environment.

```go
func TestMain(m *testing.M) {
    goleak.VerifyTestMain(m)
}
```

## Putting it together: a practical gate

The combination that has worked well, whether the diff came from me or from an AI agent:

| Stage | Command | Catches |
| --- | --- | --- |
| Format | `gofmt -l .` / `goimports -w .` | Style drift |
| Vet | `go vet ./...` | Compiler-adjacent bugs |
| Lint | `golangci-lint run ./...` | Unhandled errors, dead code, unclosed resources |
| Style/perf | `gocritic check ./...` | Inefficient or awkward patterns |
| Nil safety | `nilaway ./...` | Nil-pointer panics |
| Security | `govulncheck ./...` | Known vulnerable dependencies |
| Concurrency | `go test -race ./...` + `goleak` | Races, goroutine leaks |

Wired into a pre-commit hook and a CI pipeline, this is a few seconds of local feedback and a hard gate before merge — cheap enough to run on every commit, thorough enough that "the AI wrote it" stops being a reason to trust a diff less.

## Summary

None of these tools replace review — they replace the *slow, error-prone parts* of review, so the human (or the next AI pass) can spend attention on the things that actually need judgment: is this the right design, not just "is this technically correct." As more Go code gets drafted by agents, that separation — mechanical checks handled by tools, judgment calls handled by people — is what keeps the codebase trustworthy.

## Resources

- [golangci-lint](https://golangci-lint.run/): Fast, parallel Go linters runner with a single config file.
- [gocritic](https://github.com/go-critic/go-critic): Highly extensible Go source code linter for style and performance.
- [staticcheck](https://staticcheck.dev/): Advanced static analysis for finding bugs and performance issues.
- [nilaway](https://github.com/uber-go/nilaway): Static analysis tool to detect potential nil panics in Go code.
- [govulncheck](https://go.dev/security/vuln/): Official Go vulnerability scanner.
- [goleak](https://github.com/uber-go/goleak): Goroutine leak detector for tests.
