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
- Project overview (replaced with descriptive @ import: `See @README.md for complete project overview, installation instructions, and API documentation.`)
- Development commands (replaced with descriptive @ import: `Development workflow is documented in @README.md Development section.`)
- Architecture basics (duplicated in README - removed in US2)
- **AI-specific guidelines** (retained in US2, some migrated in US3):
  - Import alias enforcement policy
  - CLI detection pattern explanation
  - Future enhancements (validation script wrapper)
  - Zod, TypeScript, testing patterns (moved to rules in US3)
- Pattern references (replaced with descriptive @ imports to `.claude/rules/*.md` in US3)

**Validation Rules**:
- MUST be reduced in two phases: 649 → ~585 lines (US2), then ~585 → ~100 lines (US3)
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
1. Initial: Monolithic 649-line file with all content and duplicates
2. US2 Refactored: ~585 lines with @ imports to README, duplicates removed, patterns retained
3. US3 Refactored: ~100 lines with @ imports to README and rules, patterns migrated
4. Validated: Verified via `/memory` command with all @ imports resolving correctly

---

### Entity: Rule Files (`.claude/rules/*.md`)

**Purpose**: Modular, topic-specific technical patterns loaded on-demand based on file context.

**Path-Specific Loading**:
Rule files can include YAML frontmatter with a `paths` field to control when they are loaded. Rules without frontmatter are loaded unconditionally.

**Frontmatter Format**:
```yaml
---
paths:
  - "**/*.test.ts"     # Glob pattern for test files
  - "**/*.spec.ts"     # Multiple patterns supported
  - "src/**/*.{ts,tsx}" # Brace expansion supported
---
```

**Glob Pattern Support** (from official docs):
- `**/*.ts` - All TypeScript files in any directory
- `src/**/*` - All files under src/ directory
- `*.md` - Markdown files in project root
- `{src,lib}/**/*.ts` - Brace expansion for multiple directories

**Load Priority**: All rules in `.claude/rules/` are loaded at same priority as `.claude/CLAUDE.md`, with user-level rules (`~/.claude/rules/`) loaded before project rules.

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
2. **README Enhanced** (US1 complete): README has Development section, CLAUDE.md unchanged (649 lines)
3. **Duplicates Removed** (US2 complete): CLAUDE.md uses @ imports to README, duplicates removed (~585 lines, patterns retained)
4. **Rules Created** (US3 in progress): `.claude/rules/` directory exists with pattern files
5. **Patterns Migrated** (US3 complete): CLAUDE.md uses @ imports to rules, ~100 lines
6. **Validated**: `/memory` command confirms correct loading, path-specific rules work

### Transitions

```
Initial (649 lines)
  → (US1: Add Development section to README)
  → README Enhanced (649 lines)
  → (US2: Remove duplicates, add @ imports to README)
  → Duplicates Removed (~585 lines)
  → (US3: Create .claude/rules/ and extract patterns)
  → Rules Created (~585 lines)
  → (US3: Replace patterns with @ imports to rules)
  → Patterns Migrated (~100 lines)
  → (Validate with /memory command)
  → Validated (~100 lines)
```

### Rollback Points

Each state is committable to git, allowing rollback:

- **README Enhanced**: Can rollback if Development section inadequate
- **Duplicates Removed**: Can rollback if @ imports to README don't resolve
- **Rules Created**: Can rollback if directory structure incorrect
- **Patterns Migrated**: Can rollback if pattern extraction incomplete or @ imports to rules don't resolve
- **Validated**: Can rollback if `/memory` command shows errors or path-specific rules fail

---

## Metrics

### Size Metrics

**CLAUDE.md Phased Reduction**:

| Phase | Lines | Description |
|-------|-------|-------------|
| Initial | 649 | Monolithic with duplicates |
| After US2 | ~585 | Duplicates removed, @ imports added, patterns retained |
| After US3 | ~100 | Patterns migrated to rules, final structure |
| **Total Reduction** | **-549 (85%)** | **Phased over US2 and US3** |

**All Files**:

| File | Before (lines) | After US1 | After US2 | After US3 | Final Change |
|------|---------------|-----------|-----------|-----------|--------------|
| CLAUDE.md | 649 | 649 | ~585 | ~100 | -549 (85% reduction) |
| README.md | ~150 | ~250 | ~250 | ~250 | +100 (Development section) |
| .claude/rules/zod-patterns.md | 0 | 0 | 0 | ~250 | +250 (new file) |
| .claude/rules/typescript-patterns.md | 0 | 0 | 0 | ~150 | +150 (new file) |
| .claude/rules/testing-patterns.md | 0 | 0 | 0 | ~100 | +100 (new file) |
| **Total** | **799** | **899** | **835** | **850** | **+51 (overhead for structure)** |

**Context Load** (default - zod and typescript always loaded):
- Before: 649 lines (CLAUDE.md only)
- After: ~142 (CLAUDE.md) + ~179 (zod) + ~201 (typescript) = ~522 lines (20% reduction)

**Context Load** (test file - testing patterns also loaded):
- Before: 649 lines (CLAUDE.md only)
- After: ~142 (CLAUDE.md) + ~179 (zod) + ~201 (typescript) + ~111 (testing) = ~633 lines (3% increase)

**Note**: Primary benefit is eliminating duplication between CLAUDE.md and README, and establishing modular structure for maintainability. Token savings are modest due to zod/typescript patterns being always loaded (design decision: developers typically work on TypeScript files).

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
