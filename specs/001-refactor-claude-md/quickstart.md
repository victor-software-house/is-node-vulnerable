# Quickstart: CLAUDE.md Refactoring

**Feature**: 001-refactor-claude-md
**Date**: 2026-01-15
**Estimated Duration**: 2-3 hours (manual documentation refactoring)

## Overview

Refactor CLAUDE.md from a monolithic 649-line file to a modular structure using @ import syntax. This eliminates duplication with README.md, reduces default context load by 85%, and enables on-demand pattern loading.

## Prerequisites

- Claude Code CLI v0.3.0+ installed
- `.claude/` directory initialized as independent git repository
- Current CLAUDE.md and README.md files exist in project root
- Git configured with `.git/info/exclude` containing `/.claude/`

**Verification**:
```bash
# Check Claude Code version
claude --version  # Must be >= 0.3.0

# Verify .claude/ is independent repo
cd .claude && git status  # Should show git repository

# Verify git exclusion
grep "/.claude/" ../.git/info/exclude  # Should show exclusion entry
```

## Implementation Steps

### Step 1: Enhance README.md with Development Section

**Duration**: 30-45 minutes

**Objective**: Add comprehensive Development section to README.md so it serves as single source of truth for both human developers and AI assistants.

**Actions**:

1. Open `README.md` and locate the section after API documentation
2. Add new "## Development" section with these subsections:
   - **Commands**: All pnpm scripts from CLAUDE.md
   - **Architecture**: Flat structure, import aliases, build system, data bundling
   - **Testing**: Vitest setup, test patterns, coverage
   - **GitHub Actions**: Daily automation workflow
   - **Configuration Repositories**: Links to `.claude/` and `.specify/` GitHub repos

3. Copy content from CLAUDE.md sections:
   - "Development Commands" → README "Commands" subsection
   - "Architecture" → README "Architecture" subsection
   - "Testing" → README "Testing" subsection
   - "GitHub Actions Automation" → README "GitHub Actions" subsection
   - "Configuration Repositories" → README "Configuration Repositories" subsection

4. Verify standalone readability:
   - New developer should be able to set up project using only README
   - All commands should be copy-pasteable
   - Architecture decisions should have rationale

**Validation**:
```bash
# Check that Development section is complete
grep -A 50 "## Development" README.md | head -100

# Verify it contains commands
grep "pnpm build" README.md  # Should find command

# Verify it contains architecture
grep "flat module structure" README.md  # Should find architecture details
```

**Commit**:
```bash
git add README.md
git commit -m "docs: add Development section to README for comprehensive onboarding"
```

---

### Step 2: Create .claude/rules/ Directory Structure

**Duration**: 5 minutes

**Objective**: Set up directory structure for modular rule files.

**Actions**:

1. Change to `.claude/` directory
2. Create `rules/` subdirectory
3. Create three empty rule files:
   - `rules/zod-patterns.md`
   - `rules/typescript-patterns.md`
   - `rules/testing-patterns.md`

**Commands**:
```bash
cd .claude
mkdir -p rules
touch rules/zod-patterns.md
touch rules/typescript-patterns.md
touch rules/testing-patterns.md
```

**Validation**:
```bash
# Verify structure
tree rules/
# Expected output:
# rules/
# ├── testing-patterns.md
# ├── typescript-patterns.md
# └── zod-patterns.md
```

**Commit**:
```bash
git add rules/
git commit -m "feat: create .claude/rules directory structure for modular patterns"
```

---

### Step 3: Migrate Patterns to Rule Files

**Duration**: 60-90 minutes (careful content extraction)

**Objective**: Extract Zod, TypeScript, and testing patterns from CLAUDE.md into modular rule files with exact content preservation.

#### 3a. Extract Zod Patterns

**Actions**:

1. Open CLAUDE.md and locate "Zod v4 Best Practices" section
2. Copy entire section (~250 lines) including:
   - Namespace import pattern
   - Type inference examples
   - Parsing strategies
   - Deprecated patterns
   - Advanced validation patterns
   - Zod v4 improvements
3. Paste into `.claude/rules/zod-patterns.md`
4. Add header:
   ```markdown
   # Zod v4 Best Practices

   Patterns and anti-patterns for using Zod v4 with TypeScript.
   ```
5. Verify all code examples maintain exact formatting
6. Verify all tables preserved (deprecated patterns table)

**Validation**:
```bash
# Check file size
wc -l .claude/rules/zod-patterns.md  # Should be ~250 lines

# Verify code examples preserved
grep -c "```typescript" .claude/rules/zod-patterns.md  # Should find multiple examples

# Verify deprecated patterns table
grep "DEPRECATED:" .claude/rules/zod-patterns.md  # Should find anti-patterns
```

#### 3b. Extract TypeScript Patterns

**Actions**:

1. Open CLAUDE.md and locate "Type Safety Patterns" section
2. Copy entire section (~150 lines) including:
   - noUncheckedIndexedAccess handling
   - @tool-belt/type-predicates usage
   - ts-pattern examples
   - Functional utility libraries comparison
3. Paste into `.claude/rules/typescript-patterns.md`
4. Add header:
   ```markdown
   # TypeScript Type Safety Patterns

   Runtime type narrowing, pattern matching, and functional utilities for TypeScript.
   ```
5. Verify comparison tables preserved (Remeda vs ts-belt vs Radash)

**Validation**:
```bash
# Check file size
wc -l .claude/rules/typescript-patterns.md  # Should be ~150 lines

# Verify type predicates
grep "assertIsDefined" .claude/rules/typescript-patterns.md  # Should find examples

# Verify functional libraries
grep "Remeda" .claude/rules/typescript-patterns.md  # Should find comparison
```

#### 3c. Extract Testing Patterns

**Actions**:

1. Open CLAUDE.md and locate "Testing" section
2. Copy Vitest patterns (~100 lines) including:
   - expectTypeOf patterns
   - Concurrent tests
   - Runtime type narrowing in tests
   - Vitest advantages over Jest
3. Add YAML frontmatter at the top:
   ```yaml
   ---
   paths:
     - "**/*.test.ts"
     - "**/*.spec.ts"
   ---
   ```
4. Add header after frontmatter:
   ```markdown
   # Vitest Modern Testing Patterns

   Type testing, concurrent tests, and runtime assertions for Vitest 4.x.
   ```
5. Paste patterns below header

**Validation**:
```bash
# Check file size
wc -l .claude/rules/testing-patterns.md  # Should be ~105 lines (100 + frontmatter)

# Verify frontmatter
head -5 .claude/rules/testing-patterns.md  # Should show YAML frontmatter

# Verify expectTypeOf
grep "expectTypeOf" .claude/rules/testing-patterns.md  # Should find examples
```

**Commit**:
```bash
git add rules/
git commit -m "feat: extract Zod, TypeScript, and testing patterns to modular rule files"
```

---

### Step 4: Refactor CLAUDE.md with @ Imports

**Duration**: 30-45 minutes

**Objective**: Replace migrated content in CLAUDE.md with @ import references, reducing file to ~100 lines.

**Actions**:

1. Open `CLAUDE.md` in editor
2. Locate "Project Overview" section and replace with:
   ```markdown
   ## Project Overview

   @README.md
   ```

3. Locate "Development Commands" section and replace with:
   ```markdown
   ## Development

   See [Development section in README.md](README.md#development) for comprehensive guide.
   ```

4. Locate Zod patterns section and replace with:
   ```markdown
   ## Zod Patterns

   @.claude/rules/zod-patterns.md
   ```

5. Locate TypeScript patterns section and replace with:
   ```markdown
   ## TypeScript Patterns

   @.claude/rules/typescript-patterns.md
   ```

6. Locate testing patterns section and replace with:
   ```markdown
   ## Testing Patterns

   @.claude/rules/testing-patterns.md
   ```

7. Retain AI-specific sections:
   - Import alias enforcement (ESLint rule configuration)
   - CLI detection pattern (import.meta.url explanation)
   - Future enhancements (validation script wrapper)

8. Verify file size reduced to ~100 lines

**Validation**:
```bash
# Check file size
wc -l CLAUDE.md  # Should be ~100 lines (vs original 649)

# Verify @ imports present
grep "@README.md" CLAUDE.md  # Should find import
grep "@.claude/rules/" CLAUDE.md  # Should find rule imports

# Verify AI-specific content retained
grep "import alias" CLAUDE.md  # Should find enforcement section
grep "CLI detection" CLAUDE.md  # Should find pattern explanation
```

**Commit**:
```bash
cd .claude
git add ../CLAUDE.md
git commit -m "refactor: replace content with @ imports, reduce to ~100 lines"
```

---

### Step 5: Validate with Claude Code

**Duration**: 15-30 minutes

**Objective**: Verify refactored documentation loads correctly in Claude Code with proper @ import resolution and path-specific rule loading.

**Actions**:

1. Open Claude Code in project directory
2. Run `/memory` command to view loaded context
3. Verify @ imports resolved:
   - README.md content included
   - Rule files referenced correctly
4. Test path-specific rule loading:
   - Open a non-test TypeScript file (e.g., `vulnerability.ts`)
   - Run `/memory` command
   - Verify testing-patterns.md NOT loaded
5. Test path-specific rule matching:
   - Open a test file (e.g., `vulnerability.test.ts`)
   - Run `/memory` command
   - Verify testing-patterns.md IS loaded
6. Check for errors or warnings in `/memory` output

**Validation Checklist**:
```
[ ] /memory command runs without errors
[ ] README.md content appears in memory context
[ ] zod-patterns.md content appears in memory context
[ ] typescript-patterns.md content appears in memory context
[ ] testing-patterns.md loads ONLY when test file is open
[ ] No circular import errors
[ ] No missing file errors
[ ] Total context ~100 lines when no rule files loaded
[ ] Total context ~500 lines when all rule files loaded
```

**If issues found**:
- Check @ import paths for typos
- Verify all referenced files exist
- Ensure no circular references
- Check YAML frontmatter syntax in testing-patterns.md

**Final Commit** (if changes needed):
```bash
cd .claude
git add --all
git commit -m "fix: address @ import resolution issues found in validation"
```

---

## Verification

### Success Criteria Checklist

- [ ] **SC-001**: CLAUDE.md reduced from 649 to ~100 lines (85% reduction)
- [ ] **SC-002**: Default context reduced by 50-70% (measure via `/memory`)
- [ ] **SC-003**: README.md serves as complete standalone documentation
- [ ] **SC-004**: Zero duplication between README.md and CLAUDE.md
- [ ] **SC-005**: Path-specific rules load only for matching file types
- [ ] **SC-006**: All technical patterns preserved with 100% accuracy
- [ ] **SC-007**: Claude Code `/memory` command shows no errors
- [ ] **SC-008**: Token usage optimized for different contexts

### File Size Verification

```bash
# Original CLAUDE.md
wc -l CLAUDE.md  # Before: 649 lines

# After refactoring
wc -l CLAUDE.md  # After: ~100 lines
wc -l .claude/rules/zod-patterns.md  # ~250 lines
wc -l .claude/rules/typescript-patterns.md  # ~150 lines
wc -l .claude/rules/testing-patterns.md  # ~100 lines
```

### Content Preservation Verification

```bash
# Verify no content loss - compare sections
grep -c "pnpm build" README.md  # Should find command
grep -c "z.infer" .claude/rules/zod-patterns.md  # Should find pattern
grep -c "expectTypeOf" .claude/rules/testing-patterns.md  # Should find pattern
grep -c "@tool-belt" .claude/rules/typescript-patterns.md  # Should find library
```

---

## Rollback Plan

If validation fails or issues are discovered:

```bash
# Rollback to previous commit
cd .claude
git log --oneline  # Find commit before refactoring
git reset --hard <commit-hash>

# Rollback main repo CLAUDE.md
cd ..
git log --oneline
git reset --hard <commit-hash>
```

**Prevention**: Each step includes a commit, allowing granular rollback to any intermediate state.

---

## Next Steps

After validation passes:

1. **Update specification documentation** (if needed):
   - Mark feature as implemented in spec.md
   - Document any deviations from original plan

2. **Create pull request** (if using PR workflow):
   - Title: "docs: refactor CLAUDE.md to modular structure with @ imports"
   - Description: Reference spec.md and link to tasks.md
   - Include before/after metrics (649 → 100 lines)

3. **Sync .claude/ configuration repository**:
   ```bash
   cd .claude
   git push origin main
   ```

4. **Document lessons learned**:
   - Add entry to `.specify/memory/` if applicable
   - Update constitution if new patterns emerged

---

## Troubleshooting

### Issue: @ import not resolving

**Symptoms**: `/memory` shows "File not found" error

**Solutions**:
- Verify file path is correct (case-sensitive on macOS/Linux)
- Check file exists: `ls -la .claude/rules/`
- Ensure @ import uses correct syntax: `@.claude/rules/file.md` or `@./rules/file.md`

### Issue: Path-specific rules always loading

**Symptoms**: testing-patterns.md loads even for non-test files

**Solutions**:
- Verify YAML frontmatter syntax (3 dashes before and after)
- Check glob patterns match intended files: `**/*.test.ts`
- Ensure paths field is array format:
  ```yaml
  paths:
    - "**/*.test.ts"
  ```

### Issue: Content appears duplicated

**Symptoms**: Same content shows up twice in `/memory` output

**Solutions**:
- Check for circular @ imports
- Verify content removed from CLAUDE.md after migration
- Ensure rule files don't @ import each other

### Issue: README too long

**Symptoms**: README.md exceeds reasonable length for onboarding docs

**Solutions**:
- Move less critical details to separate docs (CONTRIBUTING.md, ARCHITECTURE.md)
- Keep Development section focused on essential information
- Link to external resources instead of duplicating

---

## Time Estimates

| Step | Estimated Duration | Complexity |
|------|-------------------|------------|
| 1. Enhance README.md | 30-45 min | Medium - Content organization |
| 2. Create directory structure | 5 min | Low - Simple mkdir/touch |
| 3. Migrate patterns | 60-90 min | High - Careful content extraction |
| 4. Refactor CLAUDE.md | 30-45 min | Medium - @ import replacement |
| 5. Validate with Claude Code | 15-30 min | Low - Run /memory command |
| **Total** | **2-3 hours** | **Medium overall** |

**Note**: Time estimates assume familiarity with the project and Claude Code features. First-time refactoring may take longer.

---

**Quickstart Status**: Complete - Ready to begin implementation with `/speckit.tasks` command.
