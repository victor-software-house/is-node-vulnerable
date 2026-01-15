# Issues & Action Items: CLAUDE.md Refactoring

**Status**: Implementation paused - critical issues discovered
**Date**: 2026-01-15
**Last Updated**: 19:20

## Current Context

We started implementing User Story 2 (refactor CLAUDE.md with @ imports) but discovered several misalignments between our plan and the official Claude Code documentation at https://code.claude.com/docs/en/memory.md.

**What happened:**
1. Edited CLAUDE.md to use @ imports (reduced from 655 to 492 lines)
2. Removed Testing section patterns (~93 lines with expectTypeOf, concurrent tests, etc.)
3. Discovered we removed patterns that should have been migrated to rule files FIRST (User Story 3)
4. Discovered @ import syntax was incorrect (missing descriptive context)
5. Discovered confusion about CLAUDE.md location (symlink vs single file)
6. **REVERTED** changes (commit 62a663a)

**Current state:**
- CLAUDE.md restored to original 655 lines
- No changes committed to main repo
- Root `/CLAUDE.md` deleted (was stray file)
- Only `.claude/CLAUDE.md` remains (tracked in .claude subrepo)

## Critical Issues Requiring Research & Decisions

### Issue #1: @ Import Syntax - Missing Descriptive Context

**Problem:** Our plan shows bare @ imports without context for humans.

**Current plan (incorrect):**
```markdown
## Project Overview

@README.md
```

**Official docs show (correct):**
```markdown
See @README for project overview and @package.json for available npm commands.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

**Key insight:** @ imports should have descriptive text explaining what's being imported, not just bare references.

**Action items:**
- [ ] Research: Review all @ import examples in https://code.claude.com/docs/en/memory.md
- [ ] Research: Check if there are different styles for different contexts
- [ ] Decision: Define our @ import style guide
- [ ] Update: All @ import references in tasks.md, quickstart.md, data-model.md
- [ ] Update: Examples in plan.md to show correct syntax

**Affected files:**
- `tasks.md` (T015, T016, T056-T059, T060, T167-T169)
- `quickstart.md` (Step 4 examples)
- `data-model.md` (entity field descriptions)
- `plan.md` (examples in Phase 1 output)

### Issue #2: Task Order - Removing Content Before Migration

**Problem:** Current task order removes AI-specific patterns in User Story 2, but those patterns should be migrated to rule files in User Story 3 FIRST.

**Current (incorrect) task order:**
```
Phase 4 (US2): Refactor CLAUDE.md
  T017: Remove duplicated architecture content
  T018: Remove duplicated testing content  [WRONG] - removes AI patterns!
  T019: Remove duplicated GitHub actions content

Phase 5 (US3): Create rules
  T036-T055: Migrate Zod/TypeScript/Testing patterns to rule files
  T056-T062: Replace with @ imports
```

**What we should remove in US2:**
- [CORRECT] Basic "we use Vitest" info (duplicated in README)
- [CORRECT] "pnpm test commands" (duplicated in README)
- [CORRECT] Flat Module Structure basics (duplicated in README)

**What we should NOT remove in US2 (keep until US3):**
- [WRONG] Modern Vitest Patterns section (~70 lines with expectTypeOf, concurrent tests)
- [WRONG] Zod v4 Best Practices section (~250 lines)
- [WRONG] TypeScript Type Safety Patterns section (~150 lines)

**Action items:**
- [ ] Decision: Define clear boundary between "basic duplicates" vs "AI-specific patterns"
- [ ] Update: T017-T019 descriptions to clarify what to remove
- [ ] Update: Add explicit "keep" list for patterns in T020-T022
- [ ] Verify: README contains the "basics" we plan to reference
- [ ] Review: Does the "Testing" section in README have enough for humans?

**Affected files:**
- `tasks.md` (T017-T019 descriptions, T020-T022 descriptions)
- `data-model.md` (state transitions showing what moves when)
- `quickstart.md` (Step 4 should NOT show removing patterns)

### Issue #3: CLAUDE.md Location - Symlink Confusion

**Problem:** Plan.md mentions symlink, but official docs say it's ONE location OR THE OTHER.

**Official docs state:**
> Project memory can be stored in either `./CLAUDE.md` or `./.claude/CLAUDE.md`

**Our plan.md says:**
```
.claude/
├── CLAUDE.md               # Symlink to ../CLAUDE.md
```

**Current reality:**
- Root `/CLAUDE.md` - was a stray file (now deleted)
- `.claude/CLAUDE.md` - the real file (tracked in .claude subrepo)

**Action items:**
- [ ] Research: Search entire spec directory for "symlink" mentions
- [ ] Research: Check if symlinks are mentioned anywhere in official docs
- [ ] Decision: Confirm we use ONLY `.claude/CLAUDE.md` (not root)
- [ ] Update: Remove or correct symlink mentions in plan.md, data-model.md
- [ ] Verify: No references to root `./CLAUDE.md` in tasks
- [ ] Update: Documentation structure diagrams

**Search needed:**
```bash
grep -r "symlink" specs/001-refactor-claude-md/
grep -r "CLAUDE.md" specs/001-refactor-claude-md/ | grep -v ".claude/CLAUDE.md"
```

**Affected files:**
- `plan.md` (Project Structure section line ~100)
- `data-model.md` (entity descriptions)
- Possibly others - need to grep

### Issue #4: Expected Line Counts - May Be Unrealistic

**Problem:** Plan says CLAUDE.md will be ~100 lines after User Story 2, but the math doesn't add up.

**Current CLAUDE.md breakdown (655 lines):**
- Header, Config Repos, Future Enhancements: ~65 lines
- Architecture basics (Flat Module, Build System): ~30 lines (remove in US2)
- Import Aliases (keep, AI-specific): ~15 lines
- Validation Strategy: ~15 lines
- **Zod v4 patterns: ~250 lines** (move to rules in US3)
- CLI Detection: ~15 lines
- Testing basics: ~25 lines (remove in US2)
- **Modern Vitest Patterns: ~70 lines** (move to rules in US3)
- GitHub Actions basics: ~15 lines (remove in US2)
- TypeScript Configuration: ~15 lines
- **Type Safety Patterns: ~100 lines** (move to rules in US3)
- **Functional Libraries: ~50 lines** (move to rules in US3)
- Package Publishing, Active Tech: ~20 lines

**After US2 (before moving patterns to rules):**
- Remove ~70 lines of duplicates
- Keep ~585 lines (including patterns)
- **NOT ~100 lines as planned!**

**After US3 (after moving patterns to rules):**
- Move ~470 lines to rule files
- Keep ~115 lines of structure + @ imports
- **NOW we get to ~100-115 lines**

**Action items:**
- [ ] Decision: Clarify what "~100 lines after US2" means in plan
- [ ] Update: Metrics table in data-model.md to show realistic numbers
- [ ] Update: Success metrics in tasks.md showing phased reduction
- [ ] Add: Interim line count expectations after US2, before US3

**Affected files:**
- `tasks.md` (T023, success metrics table)
- `data-model.md` (size metrics table)
- `plan.md` (summary section)

### Issue #5: Missing Research - Official Docs Deep Dive Needed

**Problem:** We need to thoroughly review official Claude Code documentation before proceeding.

**Required research topics:**
1. **@ import syntax variations**
   - Different contexts (inline vs sections)
   - Path formats (relative, absolute, home dir)
   - Best practices for descriptive text

2. **Memory hierarchy and precedence**
   - Which file loads first
   - Override behavior
   - Conflict resolution

3. **`.claude/` directory structure**
   - Required vs optional files
   - Naming conventions
   - Git integration expectations

4. **Rules directory behavior**
   - Path-specific frontmatter format
   - Glob pattern support and limitations
   - Loading order and conflicts

5. **Best practices from docs**
   - "Keep rules focused"
   - "Use descriptive filenames"
   - "Use conditional rules sparingly"

**Action items:**
- [ ] Research: Complete read of https://code.claude.com/docs/en/memory.md
- [ ] Research: Check for additional docs on project setup
- [ ] Research: Look for examples in Claude Code GitHub or docs
- [ ] Document: Create research.md section on "Official Docs Analysis"
- [ ] Validate: Current plan against official best practices

**URLs to review:**
- https://code.claude.com/docs/en/memory.md (primary)
- https://code.claude.com/docs/llms.txt (navigation)
- Any linked pages from memory.md

## Decisions Made (Session 2026-01-15)

### [DECISION 1] Revert Changes and Fix Spec First
We reverted the premature CLAUDE.md changes and decided to fix the specification documents before implementing.

### [DECISION 2] Use Only `.claude/CLAUDE.md`
Confirmed we should use ONLY `.claude/CLAUDE.md` (not root), per official docs stating it's "either ... or" not both.

### [DECISION 3] Root CLAUDE.md Was a Mistake
The root `/CLAUDE.md` was a stray file created by accident during editing. It has been deleted.

### [DECISION 4] Pause Implementation Pending Research
Status: PAUSED. Agreed to pause implementation, do thorough research on official docs, then update spec accordingly.

## Next Steps (Prioritized)

### Immediate (before continuing implementation):

1. **Complete official docs research** (Issue #5)
   - Read memory.md thoroughly
   - Document findings
   - Create reference guide for our team

2. **Define @ import style guide** (Issue #1)
   - Establish when to use descriptive context
   - Create examples for each usage type
   - Document in research.md

3. **Fix task order logic** (Issue #2)
   - Clearly separate "basic duplicates" from "AI patterns"
   - Update T017-T019 to be more specific
   - Verify README has the basics we reference

4. **Search and mark symlink references** (Issue #3)
   ```bash
   cd specs/001-refactor-claude-md
   grep -n "symlink" *.md
   ```

5. **Recalculate line counts** (Issue #4)
   - Create phased reduction table showing US2 vs US3
   - Update all metrics tables

### Before resuming implementation:

6. **Update all spec files** with corrections
   - plan.md
   - tasks.md
   - data-model.md
   - quickstart.md
   - research.md (add official docs analysis)

7. **Validate updated spec** against official docs
   - Check each @ import example
   - Verify task order makes sense
   - Confirm file structure matches official guidance

8. **Create implementation checklist** from corrected spec

### When ready to implement:

9. **Start fresh with User Story 2**
   - Use corrected task descriptions
   - Follow official @ import syntax
   - Only remove actual duplicates

## Files Requiring Updates

### High Priority (blocking implementation):
- [ ] `tasks.md` - Fix T015-T022, add @ import context examples
- [ ] `plan.md` - Remove/correct symlink mention, update summary
- [ ] `research.md` - Add "Official Docs Analysis" section
- [ ] `data-model.md` - Fix metrics, remove symlink references

### Medium Priority (affects validation):
- [ ] `quickstart.md` - Update examples with correct @ import syntax
- [ ] `contracts/README.md` - Verify @ import contract matches official docs

### Low Priority (documentation consistency):
- [ ] `spec.md` - May need acceptance criteria updates
- [ ] `checklists/requirements.md` - Already complete, may need notes added

## Context for Next Session

**Where we are:** Implementation paused after discovering spec issues. CLAUDE.md reverted to original state (655 lines).

**What we learned:**
1. @ imports need descriptive context, not bare references
2. Can't remove patterns before migrating them to rules
3. CLAUDE.md should be in `.claude/` only, not root
4. Line count expectations may be off by a phase

**What we need:**
1. Thorough review of official Claude Code memory.md docs
2. Clear boundary between "basic duplicates" and "AI patterns"
3. Corrected spec files before resuming implementation

**Current branch:** `001-refactor-claude-md`
**Current working directory:** `/Users/victor/workspace/victor/node-security-checker`
**.claude subrepo:** Clean (revert committed), 2 commits ahead of origin

## Related Files

- Original CLAUDE.md: `.claude/CLAUDE.md` (655 lines)
- Backup: `.claude/CLAUDE.md.backup` (655 lines, identical to current)
- This file: `specs/001-refactor-claude-md/issues.md`
- Official docs: https://code.claude.com/docs/en/memory.md

---

**Note**: This file should be updated as we resolve issues and make decisions. Keep this as the single source of truth for implementation blockers and decisions.
