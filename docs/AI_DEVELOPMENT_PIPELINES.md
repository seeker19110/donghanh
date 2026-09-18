# AI Development Pipelines

> Operating model for software development using the organizational model aliases
> **Astra**, **Sol**, **Terra**, **Luna**, and optional coding models.

## 0. How AI must use this document

This document is an execution policy, not a replacement for repository instructions.

Instruction precedence:

```text
Platform and safety instructions
  ↓
Repository AGENTS.md / CLAUDE.md
  ↓
Approved product and execution specifications
  ↓
This pipeline
  ↓
Task prompt
```

The names Astra, Sol, Terra, and Luna are organizational aliases. Resolve each alias to an
available model with equivalent capability. If an exact alias is unavailable, preserve the role,
risk tier, and escalation policy instead of silently changing governance.

At the start of a task, state the selected mode:

```text
MODE = COST_EFFICIENT | QUALITY_FIRST | HYBRID
```

Do not claim completion without current repository evidence.

---

## 1. Objectives

### Cost-Efficient

Optimize:

```text
Quality / Quota / Time
```

Use stronger models at important decision points and cheaper models for bounded execution.

### Quality-First

Optimize:

```text
Correctness
Architecture
Reliability
Security
Maintainability
Regression Prevention
```

Quota is secondary.

### Hybrid

Use the Cost-Efficient execution layer with Quality-First escalation and review at high-risk
boundaries. This is the default for normal development.

---

## 2. Model hierarchy and default roles

```text
                    ASTRA
          Architecture / Critical Reasoning
                      │
                      ▼
                     SOL
        Specification / Senior Engineering
                      │
                      ▼
                    TERRA
             Primary Implementation
                      │
                      ▼
                    LUNA
          Deterministic / Mechanical Work
```

| Model | Primary role                                      | Default effort |
| ----- | ------------------------------------------------- | -------------- |
| Astra | Architect, adversarial reviewer, blocker resolver | Medium         |
| Sol   | Specification writer, senior engineer, verifier   | Medium         |
| Terra | Primary implementation engineer                   | Medium         |
| Luna  | Deterministic and mechanical execution            | Low or Medium  |

Allocate models by:

```text
Decision Risk × Uncertainty × Blast Radius
```

Do not allocate models by lines of code. The strongest model handles the decisions that are most
expensive to get wrong.

---

## 3. Mode selection

Use `QUALITY_FIRST` when work involves one or more of:

- authentication or authorization;
- payments, entitlements, or usage accounting;
- security or sensitive data;
- destructive operations;
- data migrations;
- concurrency or distributed state;
- breaking public API changes;
- infrastructure or production-critical paths;
- irreversible architectural decisions;
- large cross-module changes.

Use `HYBRID` for most normal product development. Use `COST_EFFICIENT` for bounded, reversible,
low-risk work.

When uncertain, select the safer mode and record why.

---

## 4. End-to-end pipelines

### 4.1 Cost-Efficient

```text
Luna/Terra Low–Medium  Repository discovery
          ↓
Sol Medium             Product specification
          ↓
Sol Medium             Execution specification
          └─ Astra Medium when architecture is difficult
          ↓
Sol Medium             Atomic work packages
          ↓
Terra Medium           Implementation
          ├─ Luna Low/Medium for chores
          ├─ Sol Medium for difficult code
          └─ Astra Medium for architectural blockers
          ↓
Sol Medium             Independent verification
          ↓
Astra Low/Medium       Critical audit when justified
          ↓
Merge / Release
```

### 4.2 Quality-First

```text
Sol Medium/High        Deep repository discovery
          ↓
Sol High               Formal specification
          ↓
Astra Medium           Adversarial specification review
          ↓
Sol High               Specification revision
          ↓
Astra Medium/High      Execution architecture
          ↓
Sol Medium/High        Atomic work packages
          ↓
Terra Medium/High      Implementation
          ├─ Luna Low for chores
          ├─ Sol Medium/High for complex implementation
          └─ Astra for unresolved architectural blockers
          ↓
Sol High               Independent verification
          ↓
Astra Medium           Final architectural audit
          ↓
Release gate
          ↓
RELEASE
```

### 4.3 Hybrid default

```text
Sol Medium             Specification
          ↓
Astra Medium           Architecture only when justified
          ↓
Sol Medium             Work packages
          ↓
Terra Medium           Implementation
          ├─ Luna → mechanical work
          ├─ Sol → difficult code
          └─ Astra → architectural blocker
          ↓
Sol Medium/High        Verification
          ↓
Astra Medium           Milestone or high-risk audit only
```

---

## 5. Stage 1 — Repository discovery

Model assignment:

```text
COST_EFFICIENT: Luna or Terra, Low → Medium
QUALITY_FIRST:  Sol, Medium → High
```

Determine:

- repository structure and architecture;
- relevant modules, dependencies, and entry points;
- data flows, state ownership, and interfaces;
- tests, CI, and deployment model;
- conventions, existing abstractions, and constraints.

Output: `REPO_CONTEXT.md`.

Do not design a solution before understanding the current implementation. Current code and tests
override stale conversation context.

---

## 6. Stage 2 — Product specification

Model assignment:

```text
COST_EFFICIENT: Sol Medium
QUALITY_FIRST:  Sol High
```

The specification answers `WHAT`, `WHY`, and `EXPECTED BEHAVIOR`. It must not prematurely dictate
implementation.

Required sections:

```text
Context
Goals
Non-Goals
Scope
Functional Requirements
Non-Functional Requirements
Constraints
Invariants
Interfaces
Data Contracts
Failure Behavior
Edge Cases
Security Requirements
Compatibility Requirements
Acceptance Criteria
Definition of Done
```

Output: `SPEC.md`.

### Adversarial specification review

```text
COST_EFFICIENT: Optional Astra Low/Medium
QUALITY_FIRST:  Required Astra Medium
```

Astra must try to break the specification by finding missing requirements, contradictions, hidden
assumptions, ambiguity, undefined states, security weaknesses, reliability risks, races,
compatibility issues, migration risks, missing failure modes, and unnecessary complexity.

Output: `SPEC_REVIEW.md`. Sol then revises `SPEC.md`.

---

## 7. Stage 3 — Execution specification

The product specification answers `WHAT`; the execution specification answers `HOW`.

```text
COST_EFFICIENT: Sol Medium; escalate difficult architecture to Astra Medium
QUALITY_FIRST:  Astra Medium; use High only for genuinely high-risk architecture
```

Required content:

```text
Architecture
Components and module boundaries
Interfaces and data model
State transitions
Schema changes and migration
Concurrency model
Error handling
Retry behavior and idempotency
Observability
Security controls
Dependency graph
Implementation sequence
Testing strategy
Deployment strategy
Rollback strategy
```

Output: `EXECUTION_SPEC.md`.

Every important requirement must be traceable:

```text
Requirement
  → Architecture decision
  → Implementation task
  → Code
  → Test
  → Verification evidence
```

`Requirement → probably implemented` is not acceptable.

Create `ADR-XXX.md` for important architectural decisions:

```text
Decision
Context
Alternatives
Trade-offs
Chosen Approach
Consequences
Rollback / Reversal Strategy
```

---

## 8. Stage 4 — Atomic work packages

```text
Default:       Sol Medium
QUALITY_FIRST: Sol Medium/High
```

Each work package must be independently executable without inventing new architecture.

```text
TASK-ID:

OBJECTIVE:

PRECONDITIONS:

DEPENDENCIES:

FILES / MODULES:

REQUIRED CHANGES:

INTERFACES:

INVARIANTS:

ACCEPTANCE CRITERIA:

REQUIRED TESTS:

FORBIDDEN CHANGES:

ESCALATION CONDITIONS:
```

Order work as a dependency DAG where possible. Define shared contracts before parallel work. Do
not assign multiple agents to the same abstraction unless ownership and sequencing are explicit.

---

## 9. Stage 5 — Implementation

### Terra: primary implementation

```text
Default:       Terra Medium
QUALITY_FIRST: Terra Medium/High
```

Use for normal features, multi-file changes, integration, refactoring, normal bug fixes, and test
implementation.

### Luna: deterministic work

Use Luna for formatting, lint fixes, renaming, boilerplate, documentation, simple fixtures, simple
unit tests, generated structures, and repetitive mechanical refactoring.

```text
Default: Luna Low
Context-heavy deterministic work: Luna Medium
```

Luna must not decide architecture.

### Sol: difficult implementation

Escalate to Sol for complex state, concurrency, cross-subsystem behavior, difficult algorithms,
migration logic, security-sensitive logic, difficult API contracts, hard debugging, or ambiguous
behavior.

```text
Default:          Sol Medium
Quality-critical: Sol High
```

### Astra: exceptional coding

Astra is not the default coder. Use it directly only for novel problems, architectural blockers,
extremely difficult debugging, complex concurrency, critical security logic, high-blast-radius
refactors, or problems Sol cannot resolve. Prefer Astra for the decision or blocker, then return
implementation to Sol or Terra.

### Implementation agent contract

```text
Implement only the assigned scope.
Do not redesign architecture unless explicitly authorized.
Do not silently weaken requirements.
Do not remove or weaken tests to make CI pass.
Do not change unrelated code unless required.
Follow repository conventions and preserve user changes.
Run required verification.
Report deviations and remaining risks.
Escalate when the execution specification is insufficient.
```

---

## 10. Escalation, retry, and blockers

### Model escalation

```text
Luna → Terra → Sol → Astra
```

Escalate because required reasoning exceeds the current tier, not because a test failed once, a
command failed, a syntax error occurred, or tooling had a transient issue.

### Effort escalation

```text
Low → Medium → High
```

Use High only for high blast radius, irreversible decisions, cross-system architecture,
concurrency, complex migration, security-critical behavior, unfamiliar architecture, large
dependency graphs, conflicting constraints, or unresolved uncertainty after Medium effort.

### Retry policy

```text
Attempt 1
  ↓
Diagnose using evidence
  ↓
Attempt 2 with a materially corrected approach
  ↓
Still failing?
  ↓
Escalate
```

Do not repeat the same reasoning indefinitely.

### Blocker report

```text
BLOCKER:

Observed behavior:

Expected behavior:

Evidence:

Attempts made:

Likely cause:

Unknowns:

Decision required:

Recommended escalation:
```

The receiving agent continues from the evidence instead of restarting from zero.

---

## 11. Context and source of truth

Use minimum sufficient context. A task should receive only the relevant specification sections,
execution specification sections, task contract, files, interfaces, tests, and known constraints.

After a long milestone, compress raw conversation into canonical state:

```text
Decisions
Completed work
Current architecture
Unresolved issues
Next tasks
```

Store canonical state in repository documents. Source priority:

```text
Code
↓
Tests
↓
Current SPEC
↓
Current EXECUTION_SPEC
↓
Decision records
↓
Conversation history
```

Old chat must not override the current repository.

---

## 12. Verification strategy

Consider, as appropriate:

```text
Static checks
Unit tests
Integration tests
Contract tests
Regression tests
End-to-end tests
```

Not every feature requires every layer. The test set must match risk and acceptance criteria.

### Independent verification

In Quality-First mode, an independent Sol reviewer must identify missing tests and verify the
implementation rather than merely accepting the implementer's assumptions.

Sol reads:

```text
SPEC
EXECUTION_SPEC
DIFF
TEST_RESULTS
```

Sol verifies requirement coverage, correctness, architecture compliance, edge cases, negative
paths, regression, security, compatibility, test quality, and unintended changes.

Output: `VERIFICATION_REPORT.md`.

### Negative testing

Ask:

```text
What should fail?
What happens with invalid input?
What happens with partial state?
What happens after timeout or retry?
What happens when a dependency fails?
What happens at boundaries?
```

### Regression testing

```text
Bug → Reproduction → Regression test → Fix → Passing test
```

Do not fix an important bug without retaining evidence that prevents recurrence.

---

## 13. Specialized risk policies

### Security

Review authentication, authorization, input validation, injection, secrets, sensitive logging,
privilege boundaries, data exposure, replay, rate limiting, CSRF/CORS where applicable, and
dependency risk.

```text
Sol High     → verification
Astra Medium → critical audit
```

### Database migrations

Require forward migration, backward compatibility, existing-data handling, partial-failure
behavior, rollback/recovery, deployment ordering, and a verification query or test. A schema that
compiles is not proof that migration is safe.

### Public APIs

Document the existing and new contracts, compatibility, versioning, consumer impact, migration
path, deprecation, and tests. Breaking changes require an explicit decision.

### Concurrency

Specify state ownership, atomicity, locking, ordering, idempotency, retries, duplicate execution,
races, and failure recovery. Prefer Sol High or Astra Medium for design.

### Observability

Consider logs, metrics, traces, errors, alertability, and debuggability. Production behavior must
be diagnosable when it fails.

### Performance

```text
Requirement → Baseline → Measurement → Bottleneck → Optimization → Measurement
```

Do not optimize by intuition alone. Use Astra only when optimization requires a major
architectural trade-off.

---

## 14. Change management

### Specification changes during implementation

```text
STOP
  ↓
Update SPEC
  ↓
Evaluate architectural impact
  ↓
Update EXECUTION_SPEC
  ↓
Update affected tasks
  ↓
Resume implementation
```

Never allow code and specification to silently diverge.

### Failure classification

```text
Verification failure
  ├─ Implementation defect → Terra/Sol
  ├─ Execution-spec defect → Sol/Astra
  └─ Product-spec defect → Sol, then Astra re-review when required
```

Do not patch implementation when the root cause is the specification.

### Git and pull requests

Prefer small coherent commits. Never mix a feature, unrelated refactor, and repository-wide
formatting in one change set.

A pull request must answer:

```text
What changed?
Why?
Which requirements are satisfied?
Which architectural decisions apply?
How was it verified?
What risks remain?
How can it be rolled back?
```

Repository-specific Git and PR policy takes precedence over this section.

---

## 15. Parallel-agent policy

Parallelize only independent tasks whose interfaces and ownership are already defined.

```text
             Foundation
                 │
         ┌────────┬────────┐
         ▼        ▼        ▼
      Task A   Task B   Task C
         │        │        │
         └────────┴────────┘
                 ▼
            Integration
```

Do not let multiple agents edit the same abstraction, migration, lockfile, generated artifact, or
shared dependency concurrently.

For especially important changes, preserve reviewer independence: do not reveal one reviewer's
conclusion to the next reviewer before the independent pass. Compare findings afterward.

Every subagent reports files changed, checks run, results, deviations, and remaining risks. The
primary agent reviews all diffs and runs the integrated verification gate.

---

## 16. Review and release gates

### Review layers

```text
Layer 1: Implementation self-check
Layer 2: Sol independent verification
Layer 3: Astra architectural audit when risk justifies it
```

### Astra final audit

Astra receives:

```text
SPEC.md
EXECUTION_SPEC.md
FINAL_DIFF
TEST_RESULTS
VERIFICATION_REPORT.md
```

It searches for architectural drift, specification deviation, hidden assumptions, missing tests,
security and reliability risks, concurrency or data-integrity defects, incorrect abstractions,
unintended behavior, and long-term maintenance risks. It does not modify code unless requested.

Output: `AUDIT_REPORT.md`.

### Quality-First release gate

```text
SPEC                    ✓
EXECUTION SPEC          ✓
IMPLEMENTATION          ✓
STATIC CHECKS           ✓
TESTS                   ✓
SOL VERIFICATION        ✓
ASTRA AUDIT             ✓
KNOWN RISKS DOCUMENTED  ✓
ROLLBACK READY          ✓
```

Only then may the release owner authorize release.

---

## 17. Model and effort matrix

| Situation                                   | Model         |
| ------------------------------------------- | ------------- |
| Mechanical edit                             | Luna          |
| Routine or multi-module implementation      | Terra         |
| Difficult implementation                    | Sol           |
| Specification and verification              | Sol           |
| Architecture or novel architectural problem | Astra         |
| Critical audit                              | Astra         |
| Routine tests                               | Terra or Luna |
| Difficult test design                       | Sol           |
| Security architecture                       | Astra         |
| Security implementation                     | Sol           |
| Migration architecture                      | Astra or Sol  |
| Normal debugging                            | Terra         |
| Difficult debugging                         | Sol           |
| Architectural debugging                     | Astra         |

Alternative coding models may join the worker layer, but governance does not change:

```text
SPEC
EXECUTION_SPEC
TASK CONTRACT
TEST CONTRACT
ESCALATION POLICY
```

Optimize strong-model quota in this order:

```text
1. Architecture decisions
2. Specification correctness
3. Difficult blockers
4. Independent verification
5. Implementation
6. Mechanical work
```

If quota is constrained, reduce the execution tier before reducing architectural reasoning for a
critical feature.

---

## 18. Prompt contracts

### Planner

```text
ROLE:
Senior specification engineer.

OBJECTIVE:
Produce an implementation-independent specification.

INPUT:
Repository context
Feature request
Existing constraints

REQUIREMENTS:
Identify goals, non-goals, invariants, edge cases, failure behavior,
security and compatibility requirements, and acceptance criteria.

DO NOT:
Invent implementation details unless required by the contract.

OUTPUT:
SPEC.md
```

### Astra architecture

```text
ROLE:
Principal software architect.

INPUT:
REPO_CONTEXT.md
SPEC.md

OBJECTIVE:
Design the safest and simplest execution architecture that fully
satisfies the specification.

ANALYZE:
Architecture, boundaries, interfaces, state, data, concurrency,
failure modes, security, migration, testing, deployment, and rollback.

REQUIRE:
Traceability from requirements to implementation strategy.

DO NOT:
Write production code unless needed to clarify an interface.

OUTPUT:
EXECUTION_SPEC.md
```

### Implementation

```text
ROLE:
Implementation engineer.

INPUT:
Relevant SPEC sections
Relevant EXECUTION_SPEC sections
Assigned work package
Relevant repository files

OBJECTIVE:
Complete the assigned task.

RULES:
Do not change architecture or expand scope.
Do not weaken requirements or tests.
Follow repository conventions and preserve unrelated user changes.

VERIFY:
Run relevant tests and applicable lint/typecheck gates.
Check every acceptance criterion in scope.
Fix implementation defects discovered during verification.

IF BLOCKED:
Report evidence using the blocker protocol and escalate.

OUTPUT:
Implementation
Files changed
Verification commands and exact results
Deviations
Remaining risks
```

### Sol verification

```text
ROLE:
Independent senior reviewer.

INPUT:
SPEC
EXECUTION_SPEC
Implementation diff
Test results

RULE:
Do not assume the implementation agent is correct.

VERIFY:
Every requirement and invariant
Architecture compliance
Failure and boundary behavior
Regression, security, and compatibility
Test quality and unintended changes

IDENTIFY:
Missing tests
Incorrect assumptions
Unintended behavior
Specification deviations

OUTPUT:
VERIFICATION_REPORT.md
```

### Astra audit

```text
ROLE:
Independent principal architect.

INPUT:
SPEC
EXECUTION_SPEC
Final diff
Test results
Verification report

OBJECTIVE:
Find high-impact defects that survived implementation and normal review.

FOCUS:
Architectural drift
Hidden assumptions
Security and reliability
Concurrency and data integrity
Migration and rollback
Long-term maintainability
Missing verification

DO NOT:
Approve automatically.
Do not rewrite working code without evidence.

OUTPUT:
AUDIT_REPORT.md
```

### Efficient end-to-end implementation prompt

```text
Inspect the minimum relevant repository context.

Implement TASK-042 according to the approved SPEC and EXECUTION_SPEC.

Run the required tests, lint, and typecheck. Fix implementation defects
discovered during verification. Do not change architecture, weaken tests,
or expand scope.

Stop and report only if an architectural decision, missing requirement,
unsafe operation, or authority boundary blocks completion.

Return:
- files changed;
- checks run and exact results;
- deviations;
- remaining risks.
```

---

## 19. Completion definition

A feature is complete only when:

```text
Requirements satisfied
Architecture respected
Implementation complete
Acceptance criteria evidenced
Tests passing
Static checks passing
Regression considered
Security considered
Documentation updated where required
Independent verification complete when required
No unresolved blocker
Known risks documented
Rollback ready when applicable
```

Passing tests alone does not prove correctness.

---

## 20. Anti-patterns

Never:

```text
Use Astra for everything
Let Luna design architecture
Let a coder silently change the specification
Rely only on a coder reviewing its own assumptions
Retry forever instead of escalating
Use High effort for every task
Send huge context for a trivial task
Write code before understanding or specifying behavior
Treat passing tests as automatic proof of correctness
Create one giant PR for unrelated changes
Claim completion without current evidence
```

---

## 21. Final operating principle

> Do not spend frontier intelligence generating routine code. Spend it preventing expensive
> mistakes.

```text
High intelligence   → High-impact decisions
Medium intelligence → Engineering reasoning
Efficient models    → Implementation
Cheaper models      → Mechanical execution
```

```text
SPEC BEFORE CODE

ARCHITECTURE BEFORE LARGE CHANGES

SMALL TASKS BEFORE IMPLEMENTATION

EVIDENCE BEFORE ESCALATION

TEST BEFORE CLAIMING DONE

INDEPENDENT REVIEW BEFORE RELEASE

ASTRA WHERE FAILURE IS EXPENSIVE
```
