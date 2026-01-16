# Contracts

**Feature**: 001-refactor-claude-md
**Date**: 2026-01-15

## Overview

This is a documentation refactoring feature with no traditional API contracts. The "contracts" are the @ import reference structure and path-specific rule loading behavior.

## Documentation Contracts

### Contract 1: @ Import Resolution

**Provider**: Claude Code CLI
**Consumer**: CLAUDE.md, rule files

**Contract**:
- Claude Code MUST resolve @ import references to file contents
- Maximum import depth: 5 hops
- Circular imports MUST be detected and blocked
- Missing files MUST produce clear error messages

**Examples**:

```markdown
# In CLAUDE.md
@README.md

# Resolution: Claude Code loads README.md content at this position
```

**Validation**: Run `/memory` command in Claude Code - should show README.md content without errors.

---

### Contract 2: Path-Specific Rule Loading

**Provider**: Claude Code CLI
**Consumer**: testing-patterns.md (with YAML frontmatter)

**Contract**:
- Files with `paths` frontmatter MUST load only when working on matching files
- Glob patterns MUST follow standard glob syntax (`**/*.test.ts`)
- Invalid patterns MUST fall back to unconditional loading
- Files without `paths` frontmatter MUST always load

**YAML Frontmatter Format**:
```yaml
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---
```

**Validation**:
1. Open non-test file → run `/memory` → testing-patterns.md should NOT appear
2. Open test file → run `/memory` → testing-patterns.md should appear

---

### Contract 3: Content Preservation

**Provider**: Migration process (manual)
**Consumer**: Developers, AI assistants

**Contract**:
- All code examples MUST maintain exact formatting after migration
- All command examples MUST remain copy-pasteable
- All rationale explanations MUST be preserved
- All version-specific guidance MUST be retained
- All links to external documentation MUST be preserved

**Validation**: Manual inspection comparing original CLAUDE.md content with migrated content in README.md and rule files.

---

### Contract 4: Single Source of Truth

**Provider**: README.md Development section
**Consumer**: Developers, CLAUDE.md (via @ import)

**Contract**:
- README.md MUST contain all user-facing development documentation
- README.md MUST be readable standalone by human developers
- CLAUDE.md MUST NOT duplicate content from README.md
- Changes to README.md MUST automatically reflect in CLAUDE.md via @ import

**Validation**:
1. Update README.md Development section
2. No changes needed to CLAUDE.md
3. Claude Code automatically sees updated content via @ import

---

## Non-Functional Contracts

### Performance Contract

**Requirement**: CLAUDE.md MUST be reduced by 75%+; default context modestly reduced with modular structure

**Metrics**:
- Before: 649 lines (monolithic CLAUDE.md)
- After: ~142 lines (CLAUDE.md) + always-loaded rule files (zod, typescript) + conditional testing patterns
- Default context (any file type): ~522 lines (20% reduction) - zod and typescript always loaded
- Test file context: ~633 lines (3% increase) - testing patterns also loaded

**Validation**: Measure `/memory` output line count in different contexts.

---

### Maintainability Contract

**Requirement**: Changes to project documentation MUST require updates in only one place

**Guarantee**:
- Development commands change → update README.md only
- Zod patterns change → update zod-patterns.md only
- Testing patterns change → update testing-patterns.md only
- No synchronization needed between files (@ imports handle automatically)

**Validation**: Update one file and verify change propagates via @ import without manual duplication.

---

## Breaking Changes

### From Monolithic to Modular Structure

**What Changed**:
- CLAUDE.md no longer contains full content inline
- Content now distributed across README.md and `.claude/rules/*.md`
- @ import syntax required for content references

**Migration Path** for other projects:
1. Enhance README.md with comprehensive Development section
2. Extract topic-specific patterns to `.claude/rules/` directory
3. Replace content in CLAUDE.md with @ import references
4. Validate with `/memory` command

**Backward Compatibility**: None - requires Claude Code v0.3.0+ with @ import support. Older versions will not resolve references.

---

## Contract Testing

### Test Case 1: README Enhancement

**Setup**: README.md without Development section
**Action**: Add Development section with 5 subsections
**Expected**: New developers can onboard using only README.md
**Validation**: Human review - can a developer set up project without asking questions?

---

### Test Case 2: @ Import Resolution

**Setup**: CLAUDE.md with `@README.md` reference
**Action**: Run `/memory` command in Claude Code
**Expected**: README.md content appears inline without errors
**Validation**: `/memory` output contains README.md Development section content

---

### Test Case 3: Path-Specific Loading (Positive)

**Setup**: testing-patterns.md with frontmatter `paths: ["**/*.test.ts"]`
**Action**: Open `vulnerability.test.ts` and run `/memory`
**Expected**: testing-patterns.md content appears in memory context
**Validation**: `/memory` output contains "Vitest Modern Testing Patterns" or similar

---

### Test Case 4: Path-Specific Loading (Negative)

**Setup**: testing-patterns.md with frontmatter `paths: ["**/*.test.ts"]`
**Action**: Open `vulnerability.ts` (non-test) and run `/memory`
**Expected**: testing-patterns.md content does NOT appear
**Validation**: `/memory` output does NOT contain testing patterns

---

### Test Case 5: Content Preservation

**Setup**: Extract Zod patterns from CLAUDE.md to zod-patterns.md
**Action**: Compare code examples before and after migration
**Expected**: Exact match including formatting, indentation, and comments
**Validation**: `diff` or manual side-by-side comparison

---

### Test Case 6: No Duplication

**Setup**: After complete refactoring
**Action**: Search for duplicated text between README.md and CLAUDE.md
**Expected**: No shared content (except @ import reference)
**Validation**: Manual grep for key phrases in both files - should find in one place only

---

## Acceptance Criteria

All contracts validated when:

- [ ] `/memory` command runs without errors
- [ ] @ imports resolve to correct file contents
- [ ] Path-specific rules load conditionally as specified
- [ ] All content preserved exactly (no information loss)
- [ ] Zero duplication between files
- [ ] README.md readable standalone
- [ ] CLAUDE.md reduced to ~100 lines
- [ ] Context load reduced ~20% (zod/typescript always loaded per design decision)

---

**Contracts Status**: Defined - All behavioral contracts documented. Ready for implementation and validation.
