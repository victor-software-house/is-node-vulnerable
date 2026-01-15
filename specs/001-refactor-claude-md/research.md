# Research: CLAUDE.md Refactoring

**Feature**: 001-refactor-claude-md
**Date**: 2026-01-15
**Status**: Complete

## Research Questions

### Q1: Claude Code @ Import Syntax Behavior

**Question**: How does Claude Code's @ import syntax work, and what are its limitations?

**Research Method**: Review Claude Code official documentation (https://code.claude.com/docs/en/memory.md)

**Findings**:

1. **Basic Syntax**: Use `@path/to/file.md` to import content from other files
2. **Supported Paths**:
   - Relative paths: `@./file.md`, `@../parent/file.md`
   - Absolute paths within project: `@/README.md`
   - User home directory: `@~/.claude/global.md`
3. **Import Depth**: Maximum 5 hops to prevent circular imports
4. **File Types**: Supports markdown (.md) and JSON files (for structured data like package.json)
5. **Circular Import Detection**: Claude Code detects and prevents circular references
6. **Error Handling**: Clear error messages for missing files or circular imports

**Decision**: Use @ imports to reference README.md from CLAUDE.md and to load modular rule files from `.claude/rules/` directory.

**Rationale**: @ imports eliminate duplication and establish single source of truth. The 5-hop limit is sufficient for this project's simple structure (CLAUDE.md → README.md is 1 hop, CLAUDE.md → rule files is 1 hop).

**Alternatives Considered**:
- Manual duplication: Rejected due to maintenance burden and risk of inconsistency
- External documentation links: Rejected because they don't provide Claude Code with inline context

---

### Q2: Path-Specific Rules Implementation

**Question**: How do path-specific rules work in Claude Code, and what frontmatter syntax is required?

**Research Method**: Review Claude Code documentation on rule files and glob pattern support

**Findings**:

1. **Frontmatter Format**:
   ```yaml
   ---
   paths:
     - "**/*.test.ts"
     - "**/*.spec.ts"
   ---
   ```

2. **Glob Pattern Support**:
   - `**` matches any directory depth
   - `*` matches any characters except `/`
   - `?` matches single character
   - `[abc]` matches character set
   - `{a,b}` matches alternatives

3. **Loading Behavior**:
   - Rules WITHOUT `paths` frontmatter: Always loaded
   - Rules WITH `paths` frontmatter: Loaded only when working on matching files
   - Multiple patterns: Any match triggers loading (OR logic)

4. **Fallback Handling**: If glob pattern is invalid, rule loads unconditionally as safety fallback

**Decision**: Use path-specific frontmatter for `testing-patterns.md` only, since Zod and TypeScript patterns may be needed across many file types.

**Rationale**: Testing patterns are clearly scoped to test files (*.test.ts, *.spec.ts). Zod patterns may appear in schema files, validators, or any TypeScript file using validation. TypeScript patterns are broadly applicable across the codebase.

**Alternatives Considered**:
- Path-specific rules for all pattern files: Rejected because Zod and TypeScript patterns are used too broadly
- No path-specific rules: Rejected because testing patterns have clear scope and represent ~100 lines of on-demand savings

---

### Q3: README.md Development Section Structure

**Question**: What structure should the new Development section in README.md follow to serve both human developers and AI assistants?

**Research Method**: Review existing CLAUDE.md content and GitHub documentation best practices

**Findings**:

1. **Current CLAUDE.md Structure** (to migrate to README):
   - Development Commands (build, test, lint, format, typecheck)
   - Architecture (flat module structure, import aliases, build system, data bundling)
   - Testing (Vitest, test patterns, coverage)
   - GitHub Actions (automation workflow)
   - Configuration Repositories (`.claude/` and `.specify/` setup)

2. **GitHub README Best Practices**:
   - Installation/Usage first (already present)
   - API documentation (already present)
   - Development setup after user-facing docs
   - Contributing guidelines near end
   - Badges at top for quick status

3. **AI Assistant Requirements**:
   - Commands must be copy-pasteable
   - Architecture decisions documented with rationale
   - Build system specifics (tsdown, not tsc)
   - Import alias enforcement (@/ pattern)

**Decision**: Add Development section to README.md with these subsections:
1. **Commands** - All pnpm scripts with descriptions
2. **Architecture** - Flat structure, import aliases, build system, data bundling
3. **Testing** - Vitest setup, test patterns, coverage
4. **GitHub Actions** - Daily automation workflow
5. **Configuration Repositories** - `.claude/` and `.specify/` setup with GitHub links

**Rationale**: This structure serves both audiences - developers get comprehensive onboarding, AI assistants get technical context via @ import instead of duplication.

**Alternatives Considered**:
- Separate DEVELOPMENT.md file: Rejected because it fragments documentation and requires additional @ import
- Keep architecture details in CLAUDE.md only: Rejected because human developers need this information too

---

### Q4: Content Migration Strategy

**Question**: How should content be migrated from CLAUDE.md to prevent information loss or duplication?

**Research Method**: Analyze current CLAUDE.md content by category and destination

**Findings**:

**Content Categories**:

1. **User-Facing Documentation** (migrate to README.md Development section):
   - Development commands (pnpm build, test, lint, etc.)
   - Architecture overview (flat structure, import aliases)
   - Build system (tsdown configuration)
   - Testing overview (Vitest setup)
   - GitHub Actions workflow
   - Configuration repositories

2. **AI-Specific Guidelines** (keep in CLAUDE.md):
   - Import alias enforcement policy
   - CLI detection pattern
   - Future enhancements (validation script wrapper)
   - Build system specifics for AI context

3. **Zod Patterns** (migrate to `.claude/rules/zod-patterns.md`):
   - Zod v4 best practices (~250 lines)
   - Type inference patterns
   - Parsing strategies
   - Deprecated patterns to avoid
   - Advanced validation patterns

4. **TypeScript Patterns** (migrate to `.claude/rules/typescript-patterns.md`):
   - Type safety patterns (~150 lines)
   - Runtime assertions (@tool-belt/type-predicates)
   - Pattern matching (ts-pattern)
   - Functional utility libraries (Remeda, ts-belt, Radash)

5. **Testing Patterns** (migrate to `.claude/rules/testing-patterns.md`):
   - Vitest modern patterns (~100 lines)
   - expectTypeOf usage
   - Concurrent tests
   - Advantages over Jest

**Decision**: Use three-phase migration:
1. **Phase 1**: Enhance README.md with Development section (user-facing docs)
2. **Phase 2**: Create rule files and migrate patterns (topic-specific content)
3. **Phase 3**: Refactor CLAUDE.md to use @ imports and retain only AI-specific guidelines

**Rationale**: Phased approach prevents information loss and allows validation at each step. Each phase produces a working state that can be tested.

**Alternatives Considered**:
- Single-pass migration: Rejected due to high risk of missing content during large refactoring
- Parallel migration: Rejected because it would create temporary duplication and confusion

---

### Q5: Validation Strategy

**Question**: How should the refactored documentation be validated to ensure Claude Code can load it correctly?

**Research Method**: Review Claude Code testing capabilities and manual validation approaches

**Findings**:

1. **Claude Code `/memory` Command**:
   - Displays all loaded memory context
   - Shows @ import resolution
   - Indicates missing files or circular imports
   - Reports path-specific rule matching

2. **Validation Steps**:
   - Run `/memory` command after each refactoring phase
   - Verify @ imports resolve correctly
   - Test path-specific rules with matching file types
   - Confirm no circular imports
   - Check that content loads without errors

3. **Manual Testing Scenarios**:
   - Open TypeScript file with Zod schemas → verify zod-patterns.md loads
   - Open test file → verify testing-patterns.md loads
   - Open non-test TypeScript file → verify testing-patterns.md does NOT load
   - View memory via `/memory` → verify total context is ~100 lines (not 649)

**Decision**: Use manual validation via Claude Code `/memory` command with scenario-based testing for path-specific rules.

**Rationale**: Claude Code `/memory` command provides direct feedback on context loading. No automated testing framework exists for Claude Code configuration validation.

**Alternatives Considered**:
- Automated testing: Rejected because no testing framework exists for Claude Code configuration
- Code review only: Rejected because runtime behavior (@ import resolution, path matching) cannot be verified by code inspection

---

## Official Documentation Analysis

**Source**: https://code.claude.com/docs/en/memory.md (Retrieved: 2026-01-15)
**Purpose**: Validate specification against authoritative Claude Code documentation

### Key Findings from Official Docs

#### 1. @ Import Syntax Requirements

**Discovery**: @ imports MUST include descriptive context text, not bare file references.

**Official Examples**:
```markdown
See @README for project overview and @package.json for available npm commands.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

**Incorrect Usage** (found in original spec):
```markdown
@README.md
@.claude/rules/zod-patterns.md
```

**Correct Usage** (updated in spec):
```markdown
See @README.md for complete project overview, installation instructions, and API documentation.

Zod v4 best practices and validation patterns: @.claude/rules/zod-patterns.md
```

**Impact**: Updated all @ import examples in tasks.md, plan.md, quickstart.md, and data-model.md.

#### 2. CLAUDE.md Location

**Discovery**: Project memory can be stored in **either** `./CLAUDE.md` **or** `./.claude/CLAUDE.md` (not both).

**Official Quote**: "Project memory can be stored in either `./CLAUDE.md` or `./.claude/CLAUDE.md`"

**Decision**: Use ONLY `.claude/CLAUDE.md` (not root with symlink).

**Rationale**: The word "either...or" indicates mutually exclusive options. Symlinks are supported for `.claude/rules/` directory sharing, but not mentioned for CLAUDE.md itself.

**Impact**: Removed symlink reference from plan.md project structure diagram.

#### 3. Memory Hierarchy

From official docs, memory types and precedence:

| Memory Type | Location | Priority | Purpose |
|-------------|----------|----------|---------|
| Enterprise policy | `/Library/Application Support/ClaudeCode/` (macOS) | Highest | Organization-wide rules |
| Project memory | `./.claude/CLAUDE.md` or `./CLAUDE.md` | High | Team-shared instructions |
| Project rules | `./.claude/rules/*.md` | Same as project memory | Modular, topic-specific |
| User memory | `~/.claude/CLAUDE.md` | Lower than project | Personal preferences |
| Project memory (local) | `./CLAUDE.local.md` | Lowest | Private project prefs |

**Key Insight**: Project rules in `.claude/rules/` have same priority as `.claude/CLAUDE.md`, with user-level rules (`~/.claude/rules/`) loaded before project rules.

#### 4. .claude/rules/ Directory Features

**All .md files auto-loaded**: All markdown files in `.claude/rules/` are automatically loaded at project memory priority.

**Path-Specific Rules YAML Frontmatter**:
```yaml
---
paths:
  - "src/api/**/*.ts"
  - "lib/**/*.ts"
  - "tests/**/*.test.ts"
---
```

**Glob Pattern Support**:
- `**/*.ts` - All TypeScript files in any directory
- `src/**/*` - All files under src/ directory
- `*.md` - Markdown files in project root
- `src/**/*.{ts,tsx}` - Brace expansion for multiple extensions
- `{src,lib}/**/*.ts` - Brace expansion for multiple directories

**Subdirectories**: Rules can be organized into subdirectories (e.g., `frontend/`, `backend/`), all `.md` files discovered recursively.

**Symlinks**: Supported for sharing common rules across projects:
```bash
ln -s ~/shared-claude-rules .claude/rules/shared
ln -s ~/company-standards/security.md .claude/rules/security.md
```

**Validation**: Our testing-patterns.md frontmatter is correct:
```yaml
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---
```

#### 5. @ Import Advanced Features

**Recursive Imports**: Imported files can recursively import additional files, max depth 5 hops.

**Path Support**:
- Relative: `@./file.md`, `@../parent/file.md`
- Absolute project: `@/README.md`
- User home: `@~/.claude/my-project-instructions.md`

**Code Span Exclusion**: Imports not evaluated inside markdown code spans and code blocks:
```markdown
This code span will not be treated as import: `@anthropic-ai/claude-code`
```

**Recursive Lookup**: Claude Code reads memories recursively from current working directory up to root, discovering nested `CLAUDE.md` files in subtrees only when files in those subtrees are read.

#### 6. Best Practices from Official Docs

For `.claude/rules/`:
- **Keep rules focused**: Each file should cover one topic
- **Use descriptive filenames**: Filename should indicate what rules cover
- **Use conditional rules sparingly**: Only add `paths` frontmatter when rules truly apply to specific file types
- **Organize with subdirectories**: Group related rules

For CLAUDE.md:
- **Be specific**: "Use 2-space indentation" better than "Format code properly"
- **Use structure**: Format as bullet points under descriptive headings
- **Review periodically**: Update as project evolves

### Specification Updates Made

Based on official documentation analysis:

1. **@ Import Syntax** (HIGH PRIORITY):
   - Updated all examples to include descriptive context
   - Affected: tasks.md (T015-T016, T056-T062), quickstart.md, data-model.md, plan.md

2. **CLAUDE.md Location** (HIGH PRIORITY):
   - Removed symlink reference from plan.md
   - Clarified single-location requirement

3. **Line Count Expectations** (HIGH PRIORITY):
   - Documented phased reduction: 649 → ~585 (US2) → ~100 (US3)
   - Updated spec.md, tasks.md, data-model.md metrics

4. **Task Sequence** (HIGH PRIORITY):
   - Clarified US2 removes only duplicates (~70 lines)
   - Clarified US3 migrates patterns (~470 lines)
   - Updated tasks.md T017-T022 descriptions

5. **RuleFile Entity** (MEDIUM PRIORITY):
   - Added comprehensive frontmatter documentation
   - Documented glob patterns and brace expansion support
   - Documented subdirectory and symlink support

### Validation Against Official Docs

[PASS] @ import syntax - Now matches official examples with descriptive context
[PASS] Path-specific rules - Frontmatter format validated against official docs
[PASS] Glob patterns - Using standard patterns from official documentation
[PASS] Memory hierarchy - Understanding aligns with official hierarchy table
[PASS] Best practices - Implementation follows official recommendations

### References

- Official Claude Code Documentation: https://code.claude.com/docs/en/memory.md
- anthropics/claude-code repository analysis via Devin MCP (2026-01-15)
- Issue analysis: specs/001-refactor-claude-md/issues.md
- Corrections summary: specs/001-refactor-claude-md/corrections-summary.md
- Detailed analysis: specs/001-refactor-claude-md/issues-analysis.md

---

## Technology Decisions

### Claude Code Features Used

| Feature | Version Required | Purpose |
|---------|-----------------|---------|
| @ import syntax | v0.3.0+ | Reference README.md and rule files |
| Path-specific rules | v0.3.0+ | Conditional loading of testing-patterns.md |
| YAML frontmatter | v0.3.0+ | Specify glob patterns for path-specific rules |
| Glob pattern matching | v0.3.0+ | Match test files (*.test.ts, *.spec.ts) |

**Verification**: Current Claude Code version supports all required features per official documentation.

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| @ import fails to resolve | High - Claude Code cannot load context | Test with `/memory` command after each change |
| Circular import created | Medium - Claude Code detects but blocks loading | Keep import structure simple (max 2 hops) |
| Path-specific rules don't match | Low - Rules load unconditionally as fallback | Test with actual test files to verify matching |
| Content loss during migration | High - Information disappears from docs | Use phased migration with validation at each step |
| README becomes too long | Low - README should be comprehensive | Focus on essential development information only |

---

## Implementation Notes

### Order of Operations

1. **README.md Enhancement** (Task 1)
   - Must complete first because CLAUDE.md will @ import it
   - Add Development section with all user-facing documentation
   - Verify standalone readability for human developers

2. **Rule Files Creation** (Task 2)
   - Create `.claude/rules/` directory structure
   - Must complete before CLAUDE.md refactoring references them

3. **Pattern Migration** (Task 3)
   - Extract patterns from CLAUDE.md to rule files
   - Preserve exact content including code examples
   - Add path-specific frontmatter only to testing-patterns.md

4. **CLAUDE.md Refactoring** (Task 4)
   - Replace migrated content with @ imports
   - Retain only AI-specific guidelines
   - Target ~100 lines total

5. **Validation** (Task 5)
   - Use `/memory` command to verify loading
   - Test path-specific rules with matching files
   - Confirm 85% context reduction achieved

### Content Preservation Checklist

During migration, verify these elements are preserved:

- [ ] All code examples maintain exact formatting
- [ ] All command-line examples remain copy-pasteable
- [ ] All rationale explanations are preserved
- [ ] All "NEVER" and anti-pattern warnings are maintained
- [ ] All links to external documentation are preserved
- [ ] All version-specific guidance (Zod v4, Vitest 4.x) is retained

---

## Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| CLAUDE.md size reduction | 649 lines → ~100 lines (85%) | Line count after refactoring |
| Default context reduction | 50-70% fewer tokens | Compare `/memory` output before/after |
| README standalone quality | New developers can onboard using only README | Human validation |
| Zero duplication | No shared content between README and CLAUDE.md | Manual inspection |
| Path-specific rules work | testing-patterns.md loads only for test files | Open test file and verify with `/memory` |
| @ import correctness | All references resolve without errors | `/memory` command shows no errors |

---

## References

- [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory.md)
- [GitHub Documentation Best Practices](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-readme-files)
- [Google Technical Writing Style Guide](https://google.github.io/styleguide/docguide/best_practices.md)

---

**Research Status**: Complete - All unknowns resolved. Ready to proceed to Phase 1 (Design & Contracts).
