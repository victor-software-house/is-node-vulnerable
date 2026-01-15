# Data Model: Documentation Structure

**Feature**: 001-refactor-claude-md
**Date**: 2026-01-15

## Overview

This refactoring treats documentation as structured data with relationships, validation rules, and state transitions. The "entities" are documentation files, and the "schema" is the @ import reference structure.

## Entities

### Entity: README.md

**Purpose**: Single source of truth for project documentation, serving both human developers and AI assistants.

**Fields**:
- Installation instructions (existing)
- Usage examples (existing)
- API documentation (existing)
- **Development section** (NEW):
  - Commands subsection
  - Architecture subsection
  - Testing subsection
  - GitHub Actions subsection
  - Configuration Repositories subsection

**Validation Rules**:
- MUST be readable standalone by human developers
- MUST contain all information currently in CLAUDE.md Development Commands section
- MUST include architecture decisions with rationale
- MUST provide copy-pasteable command examples
- MUST NOT contain AI-specific guidelines (those stay in CLAUDE.md)

**Relationships**:
- Referenced by: CLAUDE.md (via @ import)
- References: None (standalone documentation)

**State Transitions**:
1. Initial: Existing README without Development section
2. Enhanced: README with complete Development section
3. Stable: Serves as authoritative reference for @ imports

---

### Entity: CLAUDE.md

**Purpose**: AI-specific memory file that provides Claude Code with guidelines and references to avoid duplication.

**Fields**:
- Project overview (replaced with @ import to README.md)
- Development commands (replaced with @ import to README.md)
- Architecture details (replaced with @ import to README.md)
- **AI-specific guidelines** (retained):
  - Import alias enforcement policy
  - CLI detection pattern explanation
  - Future enhancements (validation script wrapper)
  - Build system specifics for AI context
- Pattern references (replaced with @ imports to `.claude/rules/*.md`)

**Validation Rules**:
- MUST be reduced to ~100 lines (from 649 lines)
- MUST use @ import syntax for all references
- MUST NOT duplicate content from README.md
- MUST NOT duplicate content from rule files
- MUST retain AI-specific guidelines not appropriate for README.md
- MUST load successfully via Claude Code `/memory` command

**Relationships**:
- References: README.md (via @ import)
- References: `.claude/rules/zod-patterns.md` (via @ import)
- References: `.claude/rules/typescript-patterns.md` (via @ import)
- References: `.claude/rules/testing-patterns.md` (via @ import)
- Referenced by: None (top-level memory file)

**State Transitions**:
1. Initial: Monolithic 649-line file with all content
2. Transitional: Content migrated to README and rule files
3. Refactored: ~100 lines with @ imports and AI-specific guidelines
4. Validated: Verified via `/memory` command

---

### Entity: Rule Files (`.claude/rules/*.md`)

**Purpose**: Modular, topic-specific technical patterns loaded on-demand based on file context.

#### Sub-Entity: zod-patterns.md

**Fields**:
- Zod v4 best practices (~250 lines)
- Type inference patterns (z.infer, z.input, z.output)
- Parsing strategies (parse vs safeParse)
- Deprecated patterns to avoid
- Advanced validation patterns (preprocess, transform, refine, superRefine)
- Common anti-patterns

**Validation Rules**:
- MUST contain complete Zod v4 guidance from original CLAUDE.md
- MUST preserve all code examples exactly
- MUST include rationale for each pattern
- MUST document deprecated v3 patterns to avoid
- NO path-specific frontmatter (loaded unconditionally)

**Relationships**:
- Referenced by: CLAUDE.md (via @ import)
- References: None

**Load Condition**: Always (no path-specific frontmatter)

---

#### Sub-Entity: typescript-patterns.md

**Fields**:
- Type safety patterns (~150 lines)
- Runtime assertions (@tool-belt/type-predicates)
- Pattern matching (ts-pattern with exhaustiveness)
- Functional utility libraries (Remeda, ts-belt, Radash)
- noUncheckedIndexedAccess handling

**Validation Rules**:
- MUST contain complete TypeScript patterns from original CLAUDE.md
- MUST preserve all code examples exactly
- MUST include library comparison tables
- MUST document when to use each utility library
- NO path-specific frontmatter (loaded unconditionally)

**Relationships**:
- Referenced by: CLAUDE.md (via @ import)
- References: None

**Load Condition**: Always (no path-specific frontmatter)

---

#### Sub-Entity: testing-patterns.md

**Fields**:
- Vitest modern patterns (~100 lines)
- expectTypeOf for type testing
- Concurrent tests (.concurrent)
- Runtime type narrowing with @tool-belt/type-predicates
- Vitest advantages over Jest

**Validation Rules**:
- MUST contain complete Vitest patterns from original CLAUDE.md
- MUST preserve all code examples exactly
- MUST include YAML frontmatter with paths field
- Path patterns MUST match: `**/*.test.ts`, `**/*.spec.ts`

**Relationships**:
- Referenced by: CLAUDE.md (via @ import)
- References: None

**Load Condition**: Only when working on files matching `**/*.test.ts` or `**/*.spec.ts`

**Frontmatter**:
```yaml
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---
```

---

## Relationships Diagram

```
README.md (enhanced with Development section)
    ↑
    | @ import
    |
CLAUDE.md (~100 lines with AI-specific guidelines)
    |
    | @ import
    ↓
.claude/rules/
    ├── zod-patterns.md (always loaded)
    ├── typescript-patterns.md (always loaded)
    └── testing-patterns.md (loaded for *.test.ts, *.spec.ts only)
```

**Import Depth**: Maximum 1 hop (CLAUDE.md → any file). Well within 5-hop limit.

**Circular Import Prevention**: No file imports CLAUDE.md, preventing any circular references.

---

## Validation Schema

### Pre-Conditions (before refactoring)

- [ ] Current CLAUDE.md exists with 649 lines
- [ ] README.md exists without Development section
- [ ] `.claude/rules/` directory does not exist
- [ ] All content to be migrated identified and categorized

### Post-Conditions (after refactoring)

- [ ] README.md has Development section with 5 subsections
- [ ] CLAUDE.md reduced to ~100 lines
- [ ] `.claude/rules/` directory exists with 3 files
- [ ] All @ imports resolve correctly via `/memory` command
- [ ] Path-specific rules load conditionally as expected
- [ ] No content loss (all original information preserved)
- [ ] No duplication (no shared content between files)

### Invariants (must hold throughout refactoring)

- Sum of all line counts after refactoring ≈ Sum before refactoring (content preserved)
- No circular @ imports at any point
- README.md remains readable standalone by humans
- All code examples maintain exact formatting
- All command examples remain copy-pasteable

---

## State Machine

### States

1. **Initial**: Monolithic CLAUDE.md (649 lines), README without Development section
2. **README Enhanced**: README has Development section, CLAUDE.md unchanged
3. **Rules Created**: `.claude/rules/` directory exists with 3 empty files
4. **Patterns Migrated**: Rule files contain patterns, CLAUDE.md still has duplicates
5. **CLAUDE Refactored**: CLAUDE.md uses @ imports, ~100 lines
6. **Validated**: `/memory` command confirms correct loading

### Transitions

```
Initial
  → (Add Development section to README)
  → README Enhanced
  → (Create .claude/rules/ directory structure)
  → Rules Created
  → (Extract patterns from CLAUDE.md to rule files)
  → Patterns Migrated
  → (Replace duplicated content with @ imports in CLAUDE.md)
  → CLAUDE Refactored
  → (Run /memory command, test path-specific rules)
  → Validated
```

### Rollback Points

Each state is committable to git, allowing rollback:

- **README Enhanced**: Can rollback if Development section inadequate
- **Rules Created**: Can rollback if directory structure incorrect
- **Patterns Migrated**: Can rollback if pattern extraction incomplete
- **CLAUDE Refactored**: Can rollback if @ imports don't resolve
- **Validated**: Can rollback if `/memory` command shows errors

---

## Metrics

### Size Metrics

| File | Before (lines) | After (lines) | Change |
|------|---------------|--------------|--------|
| CLAUDE.md | 649 | ~100 | -549 (85% reduction) |
| README.md | ~150 | ~250 | +100 (Development section) |
| .claude/rules/zod-patterns.md | 0 | ~250 | +250 (new file) |
| .claude/rules/typescript-patterns.md | 0 | ~150 | +150 (new file) |
| .claude/rules/testing-patterns.md | 0 | ~100 | +100 (new file) |
| **Total** | **799** | **850** | **+51 (overhead for structure)** |

**Context Load** (without path-specific loading):
- Before: 649 lines (CLAUDE.md only)
- After: ~100 (CLAUDE.md) + ~250 (zod) + ~150 (typescript) = ~500 lines (23% reduction)

**Context Load** (with path-specific loading, working on non-test file):
- After: ~100 (CLAUDE.md) + ~250 (zod) + ~150 (typescript) = ~500 lines (23% reduction)

**Context Load** (with path-specific loading, working on test file):
- After: ~100 (CLAUDE.md) + ~250 (zod) + ~150 (typescript) + ~100 (testing) = ~600 lines (8% reduction)

**Context Load** (working on documentation only):
- After: ~100 (CLAUDE.md) only = ~100 lines (85% reduction)

**Note**: Primary benefit is eliminating duplication and establishing modular structure. Token savings are secondary and vary by context.

---

## Migration Checklist

During content migration from CLAUDE.md to target files:

### README.md Development Section
- [ ] All command examples (pnpm build, test, lint, format, typecheck)
- [ ] Flat module structure explanation
- [ ] Import alias policy (@/ pattern)
- [ ] Build system (tsdown, not tsc)
- [ ] Data bundling (JSON imports, validation)
- [ ] Testing overview (Vitest setup)
- [ ] GitHub Actions workflow (daily updates, publishing)
- [ ] Configuration repositories (.claude/, .specify/)

### .claude/rules/zod-patterns.md
- [ ] Zod v4 namespace import pattern
- [ ] Type inference (z.infer, z.input, z.output)
- [ ] Parsing strategies (parse vs safeParse)
- [ ] Deprecated patterns table
- [ ] Advanced validation (preprocess, transform, refine, superRefine)
- [ ] Execution order explanation
- [ ] Zod v4 improvements over v3
- [ ] Anti-patterns to avoid

### .claude/rules/typescript-patterns.md
- [ ] noUncheckedIndexedAccess handling
- [ ] @tool-belt/type-predicates usage
- [ ] ts-pattern examples (match, exhaustive)
- [ ] Functional libraries comparison (Remeda, ts-belt, Radash)
- [ ] When to use each library
- [ ] Type safety patterns
- [ ] Runtime assertions

### .claude/rules/testing-patterns.md
- [ ] YAML frontmatter with paths field
- [ ] expectTypeOf patterns
- [ ] Concurrent tests (.concurrent)
- [ ] Runtime type narrowing in tests
- [ ] Vitest advantages over Jest
- [ ] Modern testing patterns

### CLAUDE.md (retained AI-specific guidelines)
- [ ] Import alias enforcement (ESLint rule configuration)
- [ ] CLI detection pattern (import.meta.url check)
- [ ] Future enhancements (validation script wrapper)
- [ ] Build system specifics for AI context
- [ ] @ import references to README and rule files

---

**Data Model Status**: Complete - All entities, relationships, and validation rules defined. Ready for implementation.
