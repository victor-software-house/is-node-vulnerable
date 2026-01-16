# Implementation Plan: CLAUDE.md Refactoring

**Branch**: `001-refactor-claude-md` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-refactor-claude-md/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor CLAUDE.md from 649 lines to ~140 lines by eliminating duplication with README.md through @ imports and migrating technical patterns to modular rule files in `.claude/rules/`. Implementation delivered in two commits: (1) @ imports + duplicate removal (649→585 lines), (2) pattern migration to modular rules (585→142 lines). Validation via hybrid approach: manual line counts, systematic spot-checking, and Claude Code `/memory` command verification.

## Technical Context

**Language/Version**: Markdown (documentation refactoring), TypeScript 5.x (for validation)
**Primary Dependencies**: Claude Code CLI (@ import syntax, path-specific rules)
**Storage**: Filesystem-based (`.claude/` directory, independent git repository)
**Testing**: Manual validation via `/memory` command + line count verification + spot-checking
**Target Platform**: Claude Code CLI environment (macOS/Linux/Windows)
**Project Type**: Documentation refactoring (no runtime code changes)
**Performance Goals**: 78% CLAUDE.md reduction (649→142 lines); modular structure for maintainability; rule files total ~470 lines (zod: 179, typescript: 182, testing: 111)
**Constraints**: Preserve 100% technical accuracy during migration, maintain backward compatibility
**Scale/Scope**: 649 lines of CLAUDE.md → 142 lines + 472 lines in modular rules (3 files)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Type Safety First
**Status**: PASS (N/A for documentation refactoring)
**Rationale**: No TypeScript code changes. Only markdown file reorganization.

### Principle II: Data Bundling & Offline-First
**Status**: PASS (N/A for documentation refactoring)
**Rationale**: No runtime code changes. Security data bundling unchanged.

### Principle III: Automated Quality Gates
**Status**: PASS
**Requirements**:
- Validation via `/memory` command (Claude Code loads all @ imports successfully)
- Line count verification (manual: 649→585→100 lines)
- Spot-checking (5-10 representative examples per rule file)
- No TypeScript/lint/test gates apply (documentation only)

### Principle IV: Simplicity & Single Responsibility
**Status**: PASS
**Requirements**:
- Documentation structure simplified (649 lines → 100 lines default context)
- Modular rules reduce cognitive load (on-demand pattern loading)
- Single responsibility: CLAUDE.md for AI-specific guidance, README.md for project documentation
- No feature creep: purely refactoring existing content

### Principle V: Test Coverage & Type Testing
**Status**: PASS (N/A for documentation refactoring)
**Rationale**: No code changes requiring tests. Validation via Claude Code load test.

### Principle VI: No AI Tool Mentions in Main Repository
**STATUS**: PASS
**Requirements**:
- README.md Development section MUST NOT mention `.claude/` directory
- README.md MUST NOT reference claude-config repository
- Configuration Repositories subsection removed from README.md per FR-001
- All AI tool mentions remain in `.claude/` subrepo only

### Principle VII: Incremental Commits
**Status**: PASS
**Requirements**:
- Two separate commits in single PR per FR-014
- Commit 1: US2 implementation (@ imports, duplicate removal, 649→585 lines)
- Commit 2: US3 implementation (modular rules migration, 585→100 lines)
- Validation gates pass before each commit
- Conventional commit format enforced

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

**Current Structure (flat module)**:
```text
node-security-checker/
├── index.ts                    # Entry point (unchanged)
├── cli.ts                      # CLI interface (unchanged)
├── vulnerability.ts            # Core logic (unchanged)
├── schedule.ts                 # EOL checking (unchanged)
├── schemas.ts                  # Zod schemas (unchanged)
├── types.ts                    # TypeScript types (unchanged)
├── logger.ts                   # Utilities (unchanged)
├── *.test.ts                   # Colocated tests (unchanged)
├── README.md                   # [MODIFIED] Enhanced Development section
├── .claude/                    # Independent git repository (private)
│   ├── CLAUDE.md               # [MODIFIED] Refactored with @ imports
│   └── rules/                  # [NEW] Modular pattern files
│       ├── zod-patterns.md     # [NEW] Zod v4 patterns (~250 lines)
│       ├── typescript-patterns.md  # [NEW] Type safety patterns (~150 lines)
│       └── testing-patterns.md     # [NEW] Vitest patterns (~100 lines)
└── .specify/                   # Independent git repository (private)
    └── [unchanged]
```

**Structure Decision**: Flat module structure preserved (Constitution Principle IV). This is a pure documentation refactoring - no TypeScript code changes. All modifications limited to:
1. README.md (add Development section)
2. CLAUDE.md (refactor with @ imports, migrate patterns)
3. `.claude/rules/` directory (create new modular rule files)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations. All constitutional principles satisfied.

This refactoring:
- Simplifies documentation structure (Principle IV)
- Maintains type safety and bundling (Principles I-II, N/A for docs)
- Uses automated validation via `/memory` command (Principle III)
- Commits incrementally (Principle VII)
- Preserves AI tool mention boundaries (Principle VI)

## Phase 0: Research & Discovery

### Research Tasks

All technical clarifications have been resolved in spec.md Clarifications section (Session 2026-01-15). No additional research required.

**Resolved Topics**:
1. Migration validation strategy - Hybrid approach documented
2. Implementation phasing - Two commits in single PR confirmed
3. Path-specific loading scope - Only testing-patterns.md uses path-based loading
4. @ Import reference stability - Whole-file imports only (no section anchors)
5. Post-refactoring validation - `/memory` command success criteria defined

### Decisions Summary

**Decision 1: Migration Validation Strategy**
- **What**: Hybrid validation approach combining three methods
- **Rationale**: Line counts catch major omissions, spot-checking verifies accuracy, `/memory` confirms Claude Code compatibility
- **Methods**: (1) Manual line count verification, (2) Systematic spot-checking of 5-10 examples per file, (3) `/memory` command load test
- **Alternatives**: Full diff review (too time-consuming), automated text comparison (can't verify semantic preservation), `/memory` only (insufficient for content accuracy)

**Decision 2: Implementation Phasing**
- **What**: Two separate commits in single pull request
- **Rationale**: Separates logical changes for easier review and rollback if needed
- **Commit 1**: US2 - @ imports + duplicate removal (649→585 lines)
- **Commit 2**: US3 - Pattern migration to modular rules (585→100 lines)
- **Alternatives**: Single commit (harder to review), separate PRs (creates intermediate broken state)

**Decision 3: Path-Specific Loading Scope**
- **What**: Path-specific frontmatter only for testing-patterns.md
- **Rationale**: Test files have predictable extensions (*.test.ts, *.spec.ts), while Zod/TypeScript patterns apply to varied contexts
- **Loading Strategy**:
  - testing-patterns.md: Automatic via `paths: ["**/*.test.ts", "**/*.spec.ts"]`
  - zod-patterns.md: Context-aware loading by Claude (no path frontmatter)
  - typescript-patterns.md: Context-aware loading by Claude (no path frontmatter)
- **Alternatives**: Path-based for all (inflexible), context-only for all (misses predictable test files)

**Decision 4: @ Import Reference Stability**
- **What**: Whole-file imports only (e.g., `@README.md`)
- **Rationale**: Claude Code doesn't support section-specific anchors, whole-file imports immune to internal restructuring
- **Format**: `@README.md`, `@.claude/rules/zod-patterns.md` (no `#section-name`)
- **Alternatives**: Section anchors (not supported), line number references (fragile)

**Decision 5: Post-Refactoring Validation**
- **What**: Multi-criteria success validation via `/memory` command
- **Rationale**: Ensures Claude Code successfully loads refactored structure before considering task complete
- **Success Criteria**:
  - All expected @ imports loaded (README.md, rule files)
  - No circular dependency warnings
  - Token count reasonable (~100 lines CLAUDE.md alone, ~300-400 total with imports)
- **Alternatives**: Manual file inspection (can't verify Claude Code compatibility), automated script (overkill for one-time refactoring)

### Best Practices Research

**Claude Code @ Import Syntax**:
- Official docs: https://code.claude.com/docs/en/memory.md
- Syntax: `@file.md` or `@path/to/file.md` (relative to project root or CLAUDE.md location)
- Max depth: 5 hops (sufficient for this project)
- Circular import detection: Built-in with clear error messages

**Path-Specific Rules (YAML Frontmatter)**:
```yaml
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---
```
- Glob patterns supported
- Conditional loading: Rules loaded only when working with matching file paths
- Fallback: Invalid patterns load rules unconditionally (safe failure mode)

**Migration Content Preservation**:
- Preserve exact code examples (no paraphrasing)
- Maintain markdown formatting (code blocks, lists, headings)
- Keep technical terminology unchanged
- Include all cross-references and links
- Verify line-by-line correspondence via spot-checking

## Phase 1: Design & Contracts

### Data Model

**Entity: README.md Development Section**
- **Purpose**: Single source of truth for project development information
- **Structure**:
  - Commands subsection (build, test, lint, format, typecheck)
  - Architecture subsection (flat module structure, import aliases, build system, data bundling)
  - Testing subsection (Vitest, test patterns, coverage)
  - GitHub Actions subsection (daily automation, data validation, publishing)
- **Content Source**: Extracted from current CLAUDE.md Development section
- **Validation**: Manual review by developer to ensure comprehensiveness

**Entity: CLAUDE.md (Refactored)**
- **Purpose**: AI-specific guidance with @ imports to avoid duplication
- **Phase 1 Structure** (~585 lines after US2):
  - Project Overview (@ import from README.md)
  - Configuration Repositories section
  - Development commands (@ import from README.md)
  - Future Enhancements section
  - Architecture section (AI-specific guidelines: import aliases, build system, CLI detection)
  - Validation Strategy section
  - TypeScript Configuration section
  - Type Safety Patterns section (~400 lines, retained for US3 migration)
  - Package Publishing section
- **Phase 2 Structure** (~100 lines after US3):
  - Project Overview (@ import from README.md)
  - Configuration Repositories section
  - Development commands (@ import from README.md)
  - Future Enhancements section
  - Architecture section (AI-specific guidelines only)
  - Validation Strategy section
  - TypeScript Configuration section (@ import rules/typescript-patterns.md)
  - Package Publishing section
- **Validation**: `/memory` command shows all @ imports loaded successfully

**Entity: .claude/rules/zod-patterns.md**
- **Purpose**: Zod v4 validation patterns and best practices
- **Size**: ~250 lines
- **Content**:
  - Zod namespace import pattern
  - Type inference (z.infer, z.input, z.output)
  - Parsing strategies (.parse vs .safeParse)
  - Advanced patterns (preprocess, transform, refine, superRefine)
  - Zod v4 improvements over v3
  - Deprecated patterns to avoid
  - Common anti-patterns
- **Loading**: Context-aware by Claude (no path-specific frontmatter)
- **Validation**: Spot-check 5-10 examples for accuracy

**Entity: .claude/rules/typescript-patterns.md**
- **Purpose**: TypeScript type safety patterns and runtime assertions
- **Size**: ~150 lines
- **Content**:
  - Runtime assertions with @tool-belt/type-predicates
  - Type narrowing after noUncheckedIndexedAccess
  - Pattern matching with ts-pattern (when to use, best practices, examples)
  - Functional utility libraries (Remeda, ts-belt, Radash)
  - Comparison and usage examples
- **Loading**: Context-aware by Claude (no path-specific frontmatter)
- **Validation**: Spot-check 5-10 examples for accuracy

**Entity: .claude/rules/testing-patterns.md**
- **Purpose**: Vitest testing patterns and best practices
- **Size**: ~100 lines
- **Content**:
  - Modern Vitest patterns (expectTypeOf, concurrent tests)
  - Type testing examples
  - Runtime type narrowing with @tool-belt/type-predicates
  - Vitest advantages over Jest
  - Test organization and execution
- **Loading**: Automatic via path-specific frontmatter (`paths: ["**/*.test.ts", "**/*.spec.ts"]`)
- **Validation**: Spot-check 5-10 examples for accuracy

### API Contracts

**N/A**: This is a documentation refactoring with no API changes. No contracts required.

### User Interface / CLI

**N/A**: No CLI changes. Purely documentation refactoring.

### Integration Points

**Integration 1: Claude Code @ Import System**
- **Component**: CLAUDE.md
- **Dependency**: README.md, .claude/rules/*.md
- **Protocol**: @ import syntax with relative file paths
- **Error Handling**: Claude Code shows clear error for missing files, circular imports
- **Validation**: `/memory` command displays loaded imports

**Integration 2: Path-Specific Rules Loading**
- **Component**: .claude/rules/testing-patterns.md
- **Trigger**: Working with files matching glob patterns
- **Protocol**: YAML frontmatter with `paths` field
- **Fallback**: Invalid patterns load rules unconditionally
- **Validation**: Manual test by editing test file, verify patterns loaded

### Quickstart

**For Developers (README.md Enhanced)**:
```bash
# 1. Read comprehensive development guide
cat README.md  # Now includes Commands, Architecture, Testing, GitHub Actions

# 2. Run development commands
pnpm build              # Build the project
pnpm test               # Run tests
pnpm lint               # Check for issues
pnpm format             # Format code
pnpm typecheck          # Type check without build
```

**For Claude Code (CLAUDE.md Refactored)**:
```bash
# 1. Load AI-specific guidance with @ imports
# CLAUDE.md automatically loads README.md via @ import

# 2. Load modular patterns on-demand
# - testing-patterns.md: Automatic when working with *.test.ts files
# - zod-patterns.md: Context-aware when working with Zod schemas
# - typescript-patterns.md: Context-aware when working with TypeScript

# 3. Validate refactoring
claude /memory  # Shows all imports loaded, ~100 lines CLAUDE.md + ~300-400 lines total
```

**Migration Workflow**:
1. Phase 1 (Commit 1): Add README Development section, refactor CLAUDE.md with @ imports
2. Validate: Line count 649→585, README has Development section, CLAUDE.md has @ imports
3. Phase 2 (Commit 2): Create .claude/rules/, migrate patterns, update CLAUDE.md
4. Validate: Line count 585→100, all patterns in rules/, `/memory` command succeeds

## Implementation Notes

### Pre-Implementation Checklist

- [x] Constitution Check completed (all principles pass)
- [x] Research decisions documented
- [x] Data model defined for all entities
- [x] Validation strategy clarified (hybrid approach)
- [x] Implementation phasing confirmed (two commits in single PR)

### Technology Stack

**Documentation Tools**:
- Markdown: Syntax for all documentation files
- YAML: Frontmatter for path-specific rules
- Claude Code CLI: @ import and path-specific loading features

**Validation Tools**:
- Claude Code `/memory` command: Verify @ imports loaded
- `wc -l`: Manual line count verification
- Manual spot-checking: 5-10 examples per rule file

### Risk Mitigation

**Risk 1: Content Loss During Migration**
- **Mitigation**: Hybrid validation (line counts + spot-checking + load test)
- **Detection**: Line count mismatch, missing examples in spot-check
- **Recovery**: Git history preserves original CLAUDE.md

**Risk 2: @ Import Syntax Errors**
- **Mitigation**: Test with `/memory` command after each commit
- **Detection**: Claude Code error messages, imports not loaded
- **Recovery**: Fix syntax, re-run `/memory` command

**Risk 3: Path-Specific Rules Not Loading**
- **Mitigation**: Manual test by editing *.test.ts file
- **Detection**: Patterns not available when working with test files
- **Recovery**: Fix YAML frontmatter, verify glob patterns

**Risk 4: Circular @ Imports**
- **Mitigation**: Keep import structure simple (CLAUDE.md → README.md, rules)
- **Detection**: Claude Code circular import warning
- **Recovery**: Remove circular reference, use alternative structure

### Agent Context Update

This is a documentation refactoring - no technology stack changes. No agent context update required.

## Next Steps

This plan is complete. Next phase:
1. Run `/speckit.tasks` command to generate task breakdown in `tasks.md`
2. Execute US2 implementation (Commit 1): README enhancement + CLAUDE.md @ imports
3. Execute US3 implementation (Commit 2): Modular rules migration
4. Final validation via `/memory` command

---

**Plan Version**: 1.0.0
**Generated**: 2026-01-15
**Status**: Complete - Ready for task generation
