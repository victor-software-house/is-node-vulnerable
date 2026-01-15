# Tasks: CLAUDE.md Refactoring

**Input**: Design documents from `/specs/001-refactor-claude-md/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No test tasks included - this is a documentation refactoring verified manually via Claude Code `/memory` command

**Organization**: Tasks are grouped by user story (P1, P2, P3) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Main repository: `README.md`, `CLAUDE.md` at root
- Claude configuration: `.claude/` directory (independent git repository)
- Rule files: `.claude/rules/` directory

---

## Phase 1: Setup (Verification)

**Purpose**: Verify prerequisites before refactoring

- [ ] T001 Verify Claude Code CLI version is v0.3.0+ with `claude --version`
- [ ] T002 Verify `.claude/` directory exists and is independent git repository
- [ ] T003 Verify `.git/info/exclude` contains `/.claude/` exclusion entry
- [ ] T004 Backup current CLAUDE.md to `.claude/CLAUDE.md.backup` for rollback safety

---

## Phase 2: Foundational (No Foundational Tasks)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: This is a documentation refactoring with no foundational blocking tasks. User stories can proceed immediately after Phase 1.

**Status**: No foundational tasks required - proceed directly to User Story 1

---

## Phase 3: User Story 1 - Enhanced README with Development Documentation (Priority: P1) - MVP

**Goal**: Add comprehensive Development section to README.md so it serves as single source of truth for both human developers and AI assistants

**Independent Test**: New developer can read only README.md and successfully set up development environment, understand architecture, and run all development commands without external guidance

**Acceptance Scenarios**:
1. README contains Development section with Commands, Architecture, Testing, and GitHub Actions subsections (Configuration Repositories excluded per Principle VI)
2. All development information from CLAUDE.md consolidated in README without AI tool mentions
3. AI assistant can import README content via @ syntax instead of duplicating information

### Implementation for User Story 1

- [ ] T005 [US1] Read current CLAUDE.md to identify content for README.md Development section
- [ ] T006 [US1] Create Development section in README.md after API documentation section
- [ ] T007 [P] [US1] Add Commands subsection to README.md with all pnpm scripts (build, test, lint, format, typecheck)
- [ ] T008 [P] [US1] Add Architecture subsection to README.md with flat module structure, import aliases, build system (tsdown), data bundling
- [ ] T009 [P] [US1] Add Testing subsection to README.md with Vitest setup, test patterns, coverage
- [ ] T010 [P] [US1] Add GitHub Actions subsection to README.md with daily automation workflow
- [X] ~~T011 [P] [US1] Add Configuration Repositories subsection to README.md~~ **SKIP - SECURITY VIOLATION**: README.md is tracked file. NEVER mention `.claude/`, `.specify/`, Claude, or AI tools in tracked files (global CLAUDE.md directive)
- [ ] T012 [US1] Verify README.md standalone readability - new developer can set up project using only README
- [ ] T013 [US1] Verify all commands are copy-pasteable and architecture decisions have rationale
- [ ] T014 [US1] Run `git add README.md && git commit -m "docs: add Development section to README for comprehensive onboarding"`

**Checkpoint**: README.md enhanced - serves as complete standalone documentation. Ready for User Story 2.

---

## Phase 4: User Story 2 - Refactor CLAUDE.md with @ Imports (Priority: P2)

**Goal**: Refactor CLAUDE.md to use @ imports to reference README.md so that AI assistant loads only AI-specific guidance without duplicating project information

**Independent Test**: Load CLAUDE.md in Claude Code and verify @ imports correctly pull content from README.md, resulting in significantly smaller CLAUDE.md file (~100 lines vs 649 lines)

**Acceptance Scenarios**:
1. CLAUDE.md reduced to ~100 lines with @ imports for README.md
2. All referenced content automatically included without duplication
3. Project information changes in README automatically reflected in CLAUDE.md via @ import
4. AI-specific guidelines (import aliases, build system, CLI detection) remain in CLAUDE.md while project overview is imported

**Dependencies**: Requires User Story 1 (README.md Development section) to be complete

### Implementation for User Story 2

- [ ] T015 [US2] Locate "Project Overview" section in CLAUDE.md and replace with descriptive @ import: `See @README.md for complete project overview, installation instructions, and API documentation.`
- [ ] T016 [US2] Locate "Development Commands" section in CLAUDE.md and replace with descriptive @ import: `Development workflow is documented in @README.md Development section. Key commands include build, test, lint, and format.`
- [ ] T017 [US2] Remove duplicated architecture content from CLAUDE.md (basic flat module structure ONLY, now in README - keep import alias patterns for US3)
- [ ] T018 [US2] Remove duplicated testing content from CLAUDE.md (basic Vitest info ONLY, now in README - keep Modern Vitest Patterns section for US3)
- [ ] T019 [US2] Remove duplicated GitHub Actions content from CLAUDE.md (workflow description ONLY, now in README)
- [ ] T020 [US2] Retain AI-specific patterns in CLAUDE.md: import alias enforcement patterns, Zod patterns, TypeScript patterns (will migrate to rules in US3)
- [ ] T021 [US2] Retain AI-specific patterns in CLAUDE.md: CLI detection pattern (import.meta.url explanation)
- [ ] T022 [US2] Retain AI-specific patterns in CLAUDE.md: Future enhancements, testing patterns (will migrate to rules in US3)
- [ ] T023 [US2] Verify CLAUDE.md file size reduced to ~585 lines with `wc -l CLAUDE.md` (patterns retained, duplicates removed - final reduction in US3)
- [ ] T024 [US2] Verify @ imports present with `grep "@README.md" CLAUDE.md`
- [ ] T025 [US2] Verify AI-specific content retained with `grep "import alias" CLAUDE.md`
- [ ] T026 [US2] Run Claude Code `/memory` command to verify @ imports resolve correctly
- [ ] T027 [US2] Verify README.md content appears in memory context without duplication
- [ ] T028 [US2] Run `git add CLAUDE.md && git commit -m "refactor: use @ imports to reference README, remove duplicates (~585 lines, patterns retained for US3)"`

**Checkpoint**: CLAUDE.md refactored with @ imports - loads README content without duplication. Ready for User Story 3.

---

## Phase 5: User Story 3 - Modular Rules Structure (Priority: P3)

**Goal**: Create topic-specific rule files in `.claude/rules/` directory so AI assistant only loads relevant pattern guidance (Zod, TypeScript, testing) when working with related files

**Independent Test**: Work on TypeScript file with Zod schemas and verify only `zod-patterns.md` is loaded. Work on test file and verify `testing-patterns.md` loads via path-specific rules.

**Acceptance Scenarios**:
1. Zod v4 patterns moved to `.claude/rules/zod-patterns.md` and loaded on-demand
2. TypeScript type safety patterns moved to `.claude/rules/typescript-patterns.md` and loaded on-demand
3. Vitest testing patterns moved to `.claude/rules/testing-patterns.md` with path-specific frontmatter for test files only
4. Default context is ~100 lines (CLAUDE.md) instead of 649 lines, with patterns available on-demand

**Dependencies**: Requires User Story 2 (CLAUDE.md refactored) to be complete

### Implementation for User Story 3

#### Create Directory Structure

- [ ] T029 [US3] Change to `.claude/` directory with `cd .claude`
- [ ] T030 [US3] Create `rules/` subdirectory with `mkdir -p rules`
- [ ] T031 [P] [US3] Create empty file `.claude/rules/zod-patterns.md` with `touch rules/zod-patterns.md`
- [ ] T032 [P] [US3] Create empty file `.claude/rules/typescript-patterns.md` with `touch rules/typescript-patterns.md`
- [ ] T033 [P] [US3] Create empty file `.claude/rules/testing-patterns.md` with `touch rules/testing-patterns.md`
- [ ] T034 [US3] Verify directory structure with `tree rules/`
- [ ] T035 [US3] Run `git add rules/ && git commit -m "feat: create .claude/rules directory structure for modular patterns"`

#### Extract Zod Patterns

- [ ] T036 [US3] Open CLAUDE.md and locate "Zod v4 Best Practices" section (~250 lines)
- [ ] T037 [US3] Copy Zod v4 content including namespace import pattern, type inference, parsing strategies, deprecated patterns, advanced validation
- [ ] T038 [US3] Paste into `.claude/rules/zod-patterns.md` with header "# Zod v4 Best Practices"
- [ ] T039 [US3] Verify all code examples maintain exact formatting with `grep -c "\`\`\`typescript" .claude/rules/zod-patterns.md`
- [ ] T040 [US3] Verify deprecated patterns table preserved with `grep "DEPRECATED:" .claude/rules/zod-patterns.md`
- [ ] T041 [US3] Verify file size approximately 250 lines with `wc -l .claude/rules/zod-patterns.md`

#### Extract TypeScript Patterns

- [ ] T042 [US3] Open CLAUDE.md and locate "Type Safety Patterns" section (~150 lines)
- [ ] T043 [US3] Copy TypeScript content including noUncheckedIndexedAccess, @tool-belt/type-predicates, ts-pattern, functional libraries
- [ ] T044 [US3] Paste into `.claude/rules/typescript-patterns.md` with header "# TypeScript Type Safety Patterns"
- [ ] T045 [US3] Verify type predicates preserved with `grep "assertIsDefined" .claude/rules/typescript-patterns.md`
- [ ] T046 [US3] Verify functional libraries comparison with `grep "Remeda" .claude/rules/typescript-patterns.md`
- [ ] T047 [US3] Verify file size approximately 150 lines with `wc -l .claude/rules/typescript-patterns.md`

#### Extract Testing Patterns

- [ ] T048 [US3] Open CLAUDE.md and locate "Testing" section with Vitest patterns (~100 lines)
- [ ] T049 [US3] Add YAML frontmatter to `.claude/rules/testing-patterns.md` with `paths: ["**/*.test.ts", "**/*.spec.ts"]`
- [ ] T050 [US3] Copy Vitest patterns including expectTypeOf, concurrent tests, runtime type narrowing, advantages over Jest
- [ ] T051 [US3] Paste into `.claude/rules/testing-patterns.md` after frontmatter with header "# Vitest Modern Testing Patterns"
- [ ] T052 [US3] Verify frontmatter with `head -5 .claude/rules/testing-patterns.md`
- [ ] T053 [US3] Verify expectTypeOf patterns with `grep "expectTypeOf" .claude/rules/testing-patterns.md`
- [ ] T054 [US3] Verify file size approximately 105 lines (100 + frontmatter) with `wc -l .claude/rules/testing-patterns.md`
- [ ] T055 [US3] Run `git add rules/ && git commit -m "feat: extract Zod, TypeScript, and testing patterns to modular rule files"`

#### Update CLAUDE.md with Rule Imports

- [ ] T056 [US3] Open CLAUDE.md and locate Zod patterns section
- [ ] T057 [US3] Replace Zod patterns section with "## Zod Patterns\n\nZod v4 best practices and validation patterns: @.claude/rules/zod-patterns.md"
- [ ] T058 [US3] Locate TypeScript patterns section and replace with "## TypeScript Patterns\n\nType safety patterns and functional utilities: @.claude/rules/typescript-patterns.md"
- [ ] T059 [US3] Locate testing patterns section and replace with "## Testing Patterns\n\nModern Vitest testing patterns with expectTypeOf: @.claude/rules/testing-patterns.md"
- [ ] T060 [US3] Verify rule imports present with `grep "@.claude/rules/" CLAUDE.md`
- [ ] T061 [US3] Verify CLAUDE.md size still ~100 lines with `wc -l CLAUDE.md`
- [ ] T062 [US3] Run `git add ../CLAUDE.md && git commit -m "refactor: replace pattern sections with @ imports to rule files"`

#### Validate Modular Structure

- [ ] T063 [US3] Open Claude Code in project directory
- [ ] T064 [US3] Run `/memory` command to view loaded context
- [ ] T065 [US3] Verify README.md content appears in memory context
- [ ] T066 [US3] Verify zod-patterns.md content appears in memory context
- [ ] T067 [US3] Verify typescript-patterns.md content appears in memory context
- [ ] T068 [US3] Open non-test TypeScript file (e.g., `vulnerability.ts`) and run `/memory` command
- [ ] T069 [US3] Verify testing-patterns.md NOT loaded for non-test files
- [ ] T070 [US3] Open test file (e.g., `vulnerability.test.ts`) and run `/memory` command
- [ ] T071 [US3] Verify testing-patterns.md IS loaded for test files
- [ ] T072 [US3] Verify no circular import errors in `/memory` output
- [ ] T073 [US3] Verify no missing file errors in `/memory` output
- [ ] T074 [US3] If validation issues found, fix @ import paths and run `git commit -m "fix: address @ import resolution issues found in validation"`

**Checkpoint**: Modular rules structure complete - patterns loaded on-demand based on file context. All user stories implemented.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [ ] T075 Verify CLAUDE.md reduced from 649 to ~100 lines with `wc -l CLAUDE.md` (SC-001)
- [ ] T076 Verify default context reduced by 50-70% by measuring `/memory` output (SC-002)
- [ ] T077 Verify README.md serves as complete standalone documentation (SC-003)
- [ ] T078 Verify zero duplication between README.md and CLAUDE.md (SC-004)
- [ ] T079 Verify path-specific rules load only for matching file types (SC-005)
- [ ] T080 Verify all technical patterns preserved with 100% accuracy (SC-006)
- [ ] T081 Verify Claude Code `/memory` command shows no errors (SC-007)
- [ ] T082 Verify token usage optimized for different contexts (SC-008)
- [ ] T083 Run content preservation verification commands from quickstart.md
- [ ] T084 Push `.claude/` repository changes with `cd .claude && git push origin main`
- [ ] T085 Update spec.md status to "Implemented" if all success criteria met
- [ ] T086 Document any deviations from original plan in spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: No foundational tasks - proceed to User Story 1
- **User Story 1 (Phase 3)**: Can start after Setup - No dependencies on other stories
- **User Story 2 (Phase 4)**: **DEPENDS on User Story 1** - Requires README.md Development section to reference via @ import
- **User Story 3 (Phase 5)**: **DEPENDS on User Story 2** - Requires CLAUDE.md to be refactored before adding rule imports
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1) - **No dependencies on other stories**
- **User Story 2 (P2)**: **DEPENDS on User Story 1** - Must wait for README.md Development section
- **User Story 3 (P3)**: **DEPENDS on User Story 2** - Must wait for CLAUDE.md to be refactored

**IMPORTANT**: User stories MUST be implemented sequentially in priority order (P1 → P2 → P3) due to dependencies.

### Within Each User Story

**User Story 1** (README Enhancement):
- Tasks T007-T010 (subsections) can run in parallel [P]; T011 skipped (security violation)
- Task T012 (verification) must run after all subsections complete
- Task T014 (commit) must run after verification

**User Story 2** (CLAUDE.md Refactoring):
- Tasks T015-T019 (remove duplicated content) can run sequentially
- Tasks T020-T022 (retain AI-specific guidelines) can run in parallel [P] after removals
- Tasks T023-T025 (verification) must run after all changes
- Task T026-T027 (Claude Code validation) must run after file changes
- Task T028 (commit) must run after validation passes

**User Story 3** (Modular Rules):
- Tasks T031-T033 (create empty files) can run in parallel [P]
- Zod, TypeScript, Testing pattern extraction can run sequentially
- Tasks T056-T059 (update CLAUDE.md) can run sequentially
- Validation tasks T063-T073 must run after all changes complete

### Parallel Opportunities

- **Within User Story 1**: Tasks T007-T010 (4 subsections) can run in parallel [P]; T011 skipped (security violation)
- **Within User Story 2**: Tasks T020-T022 (3 AI-specific sections) can run in parallel [P]
- **Within User Story 3**: Tasks T031-T033 (3 empty files) can run in parallel [P]

**Note**: User stories themselves CANNOT run in parallel due to dependencies (US2 needs US1, US3 needs US2).

---

## Parallel Example: User Story 1 Subsections

```bash
# Launch all Development subsections together:
Task T007: "Add Commands subsection to README.md with all pnpm scripts"
Task T008: "Add Architecture subsection to README.md with flat structure"
Task T009: "Add Testing subsection to README.md with Vitest setup"
Task T010: "Add GitHub Actions subsection to README.md with automation"
# Note: T011 skipped (security violation - no AI tool mentions in MAIN repo)

# After all complete:
Task T012: "Verify README.md standalone readability"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify prerequisites)
2. Complete Phase 3: User Story 1 (README enhanced)
3. **STOP and VALIDATE**: Verify README.md serves as standalone documentation
4. Commit and review before proceeding to User Story 2

**Rationale**: User Story 1 delivers immediate value - comprehensive README that serves both humans and AI assistants. Can be used independently without User Stories 2-3.

### Incremental Delivery

1. Complete Setup → Prerequisites verified
2. Add User Story 1 → README enhanced → Commit (MVP!)
3. Add User Story 2 → CLAUDE.md refactored → Commit
4. Add User Story 3 → Modular rules → Commit
5. Each story adds value: US1 = better README, US2 = eliminate duplication, US3 = optimize token usage

### Sequential Implementation (Required)

Due to dependencies:

1. Complete Setup
2. Complete User Story 1 (P1) → Commit → Validate
3. Complete User Story 2 (P2) → Commit → Validate
4. Complete User Story 3 (P3) → Commit → Validate
5. Complete Polish → Final validation

**User stories MUST be implemented in priority order (P1 → P2 → P3) because each depends on the previous story.**

---

## Commit Strategy (Principle VI: Incremental Commits)

### Commit Points

1. **After User Story 1**: "docs: add Development section to README for comprehensive onboarding"
2. **After US1 Validation**: "docs: verify README standalone readability"
3. **After Directory Creation**: "feat: create .claude/rules directory structure for modular patterns"
4. **After Pattern Extraction**: "feat: extract Zod, TypeScript, and testing patterns to modular rule files"
5. **After CLAUDE.md US2 Changes**: "refactor: use @ imports to reference README, reduce to ~100 lines"
6. **After CLAUDE.md US3 Changes**: "refactor: replace pattern sections with @ imports to rule files"
7. **After Validation Fixes**: "fix: address @ import resolution issues found in validation"
8. **After Polish**: "docs: verify all success criteria met for CLAUDE.md refactoring"

### Commit Format

All commits follow conventional format: `type(scope): description`

**Types**: docs, feat, refactor, fix
**Scopes**: Optional (can omit)
**Description**: Brief, imperative mood, no AI tool mentions

---

## Rollback Points

Each commit creates a rollback point:

1. **After US1**: Can rollback if README Development section inadequate
2. **After Directory Creation**: Can rollback if structure incorrect
3. **After Pattern Migration**: Can rollback if extraction incomplete
4. **After US2 Refactoring**: Can rollback if @ imports don't resolve
5. **After US3 Modular Rules**: Can rollback if path-specific rules fail
6. **After Validation**: Can rollback if `/memory` shows errors

**Rollback Commands**:
```bash
cd .claude
git log --oneline  # Find commit hash
git reset --hard <commit-hash>

cd ..
git log --oneline
git reset --hard <commit-hash>
```

---

## Notes

- All tasks use exact file paths for clarity
- [P] tasks can run in parallel (different files, no dependencies)
- [Story] label (US1, US2, US3) maps task to specific user story
- User stories MUST be implemented sequentially (P1 → P2 → P3) due to dependencies
- Commit after each user story phase completion (Principle VI)
- Validation gates: Claude Code `/memory` command after each story
- No AI tool mentions in commits (never mention Claude, Anthropic, specify)
- Stop at any checkpoint to validate story independently
- Estimated total duration: 2-3 hours for manual documentation refactoring

---

## Success Metrics

| Metric | Target | Verification Method |
|--------|--------|-------------------|
| CLAUDE.md size | 649 → ~100 lines (85% reduction) | `wc -l CLAUDE.md` |
| Default context reduction | 50-70% fewer tokens | Compare `/memory` output |
| README standalone quality | New developers can onboard using only README | Human validation |
| Zero duplication | No shared content | Manual inspection |
| Path-specific rules | Load only for matching files | Open test file + `/memory` |
| @ import correctness | All references resolve | `/memory` shows no errors |
| Content preservation | 100% accuracy | Compare before/after sections |
| Token optimization | ~100 lines for documentation-only context | `/memory` output |

---

**Tasks Status**: Ready for implementation - All 86 tasks defined with exact file paths and clear acceptance criteria.
