# Specification Corrections Summary

**Date**: 2026-01-15
**Status**: Ready for specification updates
**Analysis**: See issues-analysis.md for complete findings

## Critical Corrections Required

### 1. @ Import Syntax (HIGH PRIORITY)

**Finding**: @ imports MUST include descriptive context text, not bare file references.

**Official format**:
```markdown
[CORRECT]: See @README.md for project overview and installation instructions.
[CORRECT]: Development workflow: @README.md Development section
[WRONG]: @README.md
```

**Files to update**:
- plan.md: Update all @ import examples
- tasks.md: T015, T016, T056-T062
- quickstart.md: Step 4 examples
- data-model.md: @ import entity descriptions

### 2. Task Sequence (HIGH PRIORITY)

**Finding**: User Story 2 should remove ONLY duplicates, not patterns. Patterns migrate in User Story 3.

**Correct sequence**:
```
US2: Remove ~70 lines of duplicates
  - Basic architecture (flat module only)
  - Basic testing intro
  - Basic GitHub Actions description
  Result: ~585 lines (NOT ~100)

US3: Migrate ~470 lines of patterns to rules
  - Zod patterns → .claude/rules/zod-patterns.md
  - TypeScript patterns → .claude/rules/typescript-patterns.md
  - Testing patterns → .claude/rules/testing-patterns.md
  Result: ~100 lines
```

**Files to update**:
- tasks.md: T017-T022 descriptions
- spec.md: Update acceptance scenarios with phased reduction
- data-model.md: Update state transitions and metrics table

### 3. CLAUDE.md Location (HIGH PRIORITY)

**Finding**: Use ONLY .claude/CLAUDE.md, not root with symlink.

**Official guidance**: "Project memory can be stored in either `./CLAUDE.md` or `./.claude/CLAUDE.md`"

**Current decision**: Use `.claude/CLAUDE.md` only

**Files to update**:
- plan.md: Remove symlink reference from project structure (line ~100)
- data-model.md: Update CLAUDE.md entity location description
- Search and replace: `grep -r "symlink" specs/001-refactor-claude-md/`

### 4. Line Count Expectations (HIGH PRIORITY)

**Finding**: CLAUDE.md reduces in TWO phases, not one.

**Phased reduction**:
- Initial: 655 lines
- After US2: ~585 lines (duplicates removed)
- After US3: ~100 lines (patterns migrated)

**Files to update**:
- spec.md: Success criteria SC-001
- tasks.md: T023 (add expected size note)
- data-model.md: Metrics table with three states

### 5. .claude/rules/ Documentation (MEDIUM PRIORITY)

**Finding**: Complete official documentation available for rules directory.

**Key features confirmed**:
- YAML frontmatter with `paths` field for path-specific rules
- Glob patterns including brace expansion
- Subdirectories supported
- Symlinks supported for shared rules
- All .md files auto-loaded at same priority as CLAUDE.md

**Files to update**:
- research.md: Add "Official Docs Analysis" section
- data-model.md: Add RuleFile entity with frontmatter details
- contracts/README.md: Verify path-specific loading contract

## Quick Reference: Correct @ Import Examples

```markdown
## Project Overview

See @README.md for complete project overview, installation instructions, and API documentation.

## Development

Development workflow is documented in @README.md Development section. Key commands:
- Build: pnpm build
- Test: pnpm test
- Lint: pnpm lint

For comprehensive command documentation, see @package.json scripts section.

## Zod Patterns

Zod v4 best practices and validation patterns: @.claude/rules/zod-patterns.md

## TypeScript Patterns

Type safety patterns and functional utilities: @.claude/rules/typescript-patterns.md

## Testing Patterns

Modern Vitest testing patterns with expectTypeOf: @.claude/rules/testing-patterns.md
```

## Quick Reference: Path-Specific Rules Frontmatter

```markdown
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# Vitest Modern Testing Patterns

[content here]
```

## Implementation Impact

### Blocked Until Fixed
- Cannot proceed with US2 implementation (T015-T028)
- Cannot proceed with US3 implementation (T029-T074)

### Can Proceed
- US1 implementation (T005-T014) - not affected by these corrections

## Update Checklist

High priority (blocking):
- [ ] spec.md: Update SC-001 with phased reduction
- [ ] spec.md: Update US2/US3 acceptance scenarios
- [ ] plan.md: Fix project structure (remove symlink)
- [ ] plan.md: Update all @ import examples
- [ ] tasks.md: Update T015-T016 with correct @ import syntax
- [ ] tasks.md: Update T017-T022 descriptions (duplicates vs patterns)
- [ ] tasks.md: Update T023 expected size note (~585 lines)
- [ ] tasks.md: Update T056-T062 with correct @ import syntax
- [ ] data-model.md: Update metrics table (three states)
- [ ] data-model.md: Update state transitions (phased reduction)
- [ ] data-model.md: Update @ import entity descriptions
- [ ] quickstart.md: Update Step 4 @ import examples

Medium priority (validation):
- [ ] research.md: Add "Official Docs Analysis" section
- [ ] data-model.md: Add RuleFile entity with frontmatter
- [ ] contracts/README.md: Verify @ import contract format

Low priority (consistency):
- [ ] Search for "symlink" in all spec files: `grep -r "symlink" .`
- [ ] Verify consistent terminology across specs
- [ ] Update any remaining bare @ import references

## Validation After Updates

Run these checks after updating specification files:

```bash
# 1. Verify no bare @ imports in examples
grep "@README\.md[^[]" specs/001-refactor-claude-md/*.md
# Should find zero matches (all @ imports have descriptive text)

# 2. Verify no symlink references remain
grep -i "symlink" specs/001-refactor-claude-md/*.md
# Should find zero matches (or only in context of .claude/rules/ symlinks)

# 3. Verify phased line counts documented
grep "585 lines" specs/001-refactor-claude-md/*.md
# Should find matches in spec.md, tasks.md, data-model.md

# 4. Check US2 removes only duplicates
grep "T017\|T018\|T019" specs/001-refactor-claude-md/tasks.md
# Should mention "basic" or "duplicates", not "patterns"
```

---

**Next Step**: Update specification files following the checklist above, then re-run /speckit.analyze for consistency validation.
