---
description: "Task list for CLAUDE.md refactoring implementation"
---

# Tasks: CLAUDE.md Refactoring

**Input**: Design documents from `/specs/001-refactor-claude-md/`
**Prerequisites**: plan.md (complete), spec.md (complete), data-model.md (N/A - documentation refactoring)

**Tests**: No automated tests. Manual validation via `/memory` command, line counts, and spot-checking.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Main repository**: `/Users/victor/workspace/victor/node-security-checker/`
- **Claude config**: `/Users/victor/workspace/victor/node-security-checker/.claude/` (independent git repository)
- **Documentation**: `README.md` (main repo), `CLAUDE.md` (claude config repo)

---

## Phase 1: Setup (No Infrastructure Setup Required)

**Purpose**: Validate prerequisites for documentation refactoring

**Note**: This is a pure documentation refactoring. No project structure changes or dependency installation required.

- [x] T001 Verify current CLAUDE.md line count is 649 lines via `wc -l .claude/CLAUDE.md`
- [x] T002 Create backup of current CLAUDE.md in `.claude/CLAUDE.md.backup`
- [x] T003 Verify `.claude/` is independent git repository with `cd .claude && git status`

---

## Phase 2: Foundational (No Blocking Prerequisites)

**Purpose**: This refactoring has no foundational blocking tasks - user stories can proceed immediately

**SKIP THIS PHASE**: User Story 1 can begin immediately (no shared infrastructure required)

**Checkpoint**: Ready for User Story 1 implementation

---

## Phase 3: User Story 1 - Enhanced README with Development Documentation (Priority: P1) - MVP

**Goal**: Create comprehensive Development section in README.md that consolidates all development information from CLAUDE.md, serving as single source of truth for both developers and AI assistants.

**Independent Test**: New developer reads only README.md and successfully understands project architecture, available commands, and development workflow without needing to reference CLAUDE.md or other files.

### Implementation for User Story 1

- [x] T004 [US1] Read current CLAUDE.md to identify all development content to extract (lines 1-649)
- [x] T005 [P] [US1] Create Development section outline in README.md after API section
- [x] T006 [P] [US1] Add Commands subsection to README.md with all pnpm commands (build, test, lint, format, typecheck)
- [x] T007 [P] [US1] Add Architecture subsection to README.md with flat module structure, import aliases, build system, data bundling
- [x] T008 [P] [US1] Add Testing subsection to README.md with Vitest patterns, test organization, running tests
- [x] T009 [P] [US1] Add GitHub Actions subsection to README.md with daily automation, data validation, publishing workflow
- [x] T010 [US1] Verify Development section completeness by comparing against CLAUDE.md Development content
- [x] T011 [US1] Remove "Configuration Repositories" subsection from README.md per FR-001 (Principle VI: No AI Tool Mentions)
- [x] T012 [US1] Format README.md with Prettier to ensure proper markdown formatting
- [x] T013 [US1] Validate US1 completion: README.md has comprehensive Development section, no AI tool mentions

**Checkpoint**: README.md now serves as complete standalone documentation for developers. CLAUDE.md can now reference it via @ imports.

---

## Phase 4: User Story 2 - Refactor CLAUDE.md with @ Imports (Priority: P2)

**Goal**: Refactor CLAUDE.md from 649 lines to ~585 lines by using @ import syntax to reference README.md and removing duplicated content, while retaining AI-specific patterns for migration in US3.

**Independent Test**: Load CLAUDE.md in Claude Code via `/memory` command and verify @ imports correctly pull content from README.md, resulting in ~585 line CLAUDE.md file.

### Implementation for User Story 2

- [x] T014 [US2] Read current CLAUDE.md and identify all content duplicated in README.md Development section
- [x] T015 [US2] Add `@README.md` import at top of CLAUDE.md Project Overview section
- [x] T016 [US2] Remove duplicated project overview content from CLAUDE.md (keep only `@README.md` reference)
- [x] T017 [US2] Add `@README.md` import reference in Development section of CLAUDE.md
- [x] T018 [US2] Remove duplicated development commands from CLAUDE.md (Commands, Architecture, Testing, GitHub Actions)
- [x] T019 [US2] Retain Configuration Repositories section in CLAUDE.md (AI-specific, not in README.md)
- [x] T020 [US2] Retain Future Enhancements section in CLAUDE.md (AI-specific planning, not user-facing)
- [x] T021 [US2] Retain AI-specific Architecture guidelines in CLAUDE.md (import aliases enforcement, build system details, CLI detection)
- [x] T022 [US2] Retain all Type Safety Patterns content in CLAUDE.md for US3 migration (~400 lines)
- [x] T023 [US2] Retain Package Publishing section in CLAUDE.md (AI-specific context)
- [x] T024 [US2] Format CLAUDE.md with Prettier to ensure proper markdown formatting
- [x] T025 [US2] Verify line count: CLAUDE.md should be ~585 lines (64-line reduction from 649)
- [x] T026 [US2] Test @ imports: Run `/memory` command in Claude Code and verify README.md content loaded
- [x] T027 [US2] Verify no circular import warnings in `/memory` command output
- [x] T028 [US2] Commit US2 changes with message: "docs: refactor CLAUDE.md with @ imports and remove duplicates"
- [x] T029 [US2] Validate US2 completion: CLAUDE.md ~585 lines, @ imports work, README content accessible

**Checkpoint**: CLAUDE.md now uses @ imports to reference README.md. Duplicate content eliminated. Patterns retained for US3 migration.

---

## Phase 5: User Story 3 - Modular Rules Structure (Priority: P3)

**Goal**: Migrate ~500 lines of technical patterns from CLAUDE.md to three modular rule files in `.claude/rules/` directory, reducing CLAUDE.md to ~100 lines with on-demand pattern loading.

**Independent Test**: Work on test file and verify `testing-patterns.md` automatically loads via path-specific rules. Verify `/memory` command shows all @ imports loaded with ~100 line CLAUDE.md.

### Implementation for User Story 3

#### Create Rule Files

- [x] T030 [P] [US3] Create `.claude/rules/` directory in claude config repository
- [x] T031 [P] [US3] Create `.claude/rules/zod-patterns.md` file with YAML frontmatter (no paths field)
- [x] T032 [P] [US3] Create `.claude/rules/typescript-patterns.md` file with YAML frontmatter (no paths field)
- [x] T033 [P] [US3] Create `.claude/rules/testing-patterns.md` file with YAML frontmatter including `paths: ["**/*.test.ts", "**/*.spec.ts"]`

#### Migrate Zod Patterns

- [x] T034 [US3] Extract Zod v4 content from CLAUDE.md (Zod Import Pattern, Type Inference, Parsing Strategies, Advanced Patterns sections)
- [x] T035 [US3] Copy Zod namespace import pattern to `.claude/rules/zod-patterns.md`
- [x] T036 [US3] Copy type inference examples (z.infer, z.input, z.output) to `.claude/rules/zod-patterns.md`
- [x] T037 [US3] Copy parsing strategies (.parse vs .safeParse) to `.claude/rules/zod-patterns.md`
- [x] T038 [US3] Copy advanced validation patterns (preprocess, transform, refine, superRefine) to `.claude/rules/zod-patterns.md`
- [x] T039 [US3] Copy Zod v4 improvements section to `.claude/rules/zod-patterns.md`
- [x] T040 [US3] Copy deprecated Zod v4 patterns section to `.claude/rules/zod-patterns.md`
- [x] T041 [US3] Copy common anti-patterns section to `.claude/rules/zod-patterns.md`
- [x] T042 [US3] Verify `.claude/rules/zod-patterns.md` is ~250 lines via `wc -l`

#### Migrate TypeScript Patterns

- [x] T043 [US3] Extract TypeScript type safety content from CLAUDE.md (Runtime Assertions, Pattern Matching, Functional Libraries sections)
- [x] T044 [US3] Copy runtime assertions with @tool-belt/type-predicates to `.claude/rules/typescript-patterns.md`
- [x] T045 [US3] Copy type narrowing after noUncheckedIndexedAccess to `.claude/rules/typescript-patterns.md`
- [x] T046 [US3] Copy ts-pattern usage (when to use, best practices, examples) to `.claude/rules/typescript-patterns.md`
- [x] T047 [US3] Copy functional utility libraries section (Remeda, ts-belt, Radash) to `.claude/rules/typescript-patterns.md`
- [x] T048 [US3] Copy library comparison and usage examples to `.claude/rules/typescript-patterns.md`
- [x] T049 [US3] Verify `.claude/rules/typescript-patterns.md` is ~150 lines via `wc -l`

#### Migrate Testing Patterns

- [x] T050 [US3] Extract Vitest testing content from CLAUDE.md (Modern Patterns, Type Testing, Runtime Assertions sections)
- [x] T051 [US3] Copy modern Vitest patterns (expectTypeOf, concurrent tests) to `.claude/rules/testing-patterns.md`
- [x] T052 [US3] Copy type testing examples to `.claude/rules/testing-patterns.md`
- [x] T053 [US3] Copy runtime type narrowing with @tool-belt/type-predicates to `.claude/rules/testing-patterns.md`
- [x] T054 [US3] Copy Vitest advantages over Jest section to `.claude/rules/testing-patterns.md`
- [x] T055 [US3] Copy test organization and execution guidance to `.claude/rules/testing-patterns.md`
- [x] T056 [US3] Verify `.claude/rules/testing-patterns.md` is ~100 lines via `wc -l`

#### Update CLAUDE.md

- [x] T057 [US3] Remove all Zod patterns from CLAUDE.md (content now in zod-patterns.md)
- [x] T058 [US3] Remove all TypeScript patterns from CLAUDE.md (content now in typescript-patterns.md)
- [x] T059 [US3] Remove all testing patterns from CLAUDE.md (content now in testing-patterns.md)
- [x] T060 [US3] Add `@.claude/rules/typescript-patterns.md` reference to TypeScript Configuration section in CLAUDE.md
- [x] T061 [US3] Add note in CLAUDE.md about context-aware loading for zod-patterns.md and typescript-patterns.md
- [x] T062 [US3] Add note in CLAUDE.md about automatic path-based loading for testing-patterns.md
- [x] T063 [US3] Format CLAUDE.md with Prettier to ensure proper markdown formatting

#### Validation

- [x] T064 [US3] Verify CLAUDE.md line count is 90-110 lines via `wc -l .claude/CLAUDE.md`
- [x] T065 [US3] Verify total pattern lines: zod-patterns.md (~250) + typescript-patterns.md (~150) + testing-patterns.md (~100) = ~500 lines
- [x] T066 [US3] Spot-check 5-10 Zod examples in zod-patterns.md for accuracy (compare against backup)
- [x] T067 [US3] Spot-check 5-10 TypeScript examples in typescript-patterns.md for accuracy (compare against backup)
- [x] T068 [US3] Spot-check 5-10 Vitest examples in testing-patterns.md for accuracy (compare against backup)
- [x] T069 [US3] Test path-specific loading: Create temporary test file, verify testing-patterns.md loaded
- [x] T070 [US3] Run `/memory` command in Claude Code and verify all @ imports loaded successfully
- [x] T071 [US3] Verify no circular dependency warnings in `/memory` command output
- [x] T072 [US3] Verify token count reasonable: ~100 lines CLAUDE.md alone, ~300-400 lines total with imports
- [x] T073 [US3] Commit US3 changes with message: "docs: migrate patterns to modular rules for on-demand loading"
- [x] T074 [US3] Validate US3 completion: CLAUDE.md ~100 lines, 3 rule files created, `/memory` succeeds

**Checkpoint**: All patterns migrated to modular rules. CLAUDE.md reduced to ~100 lines. Token usage optimized 85% from baseline.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T075 [P] Update `.claude/CLAUDE.md` Active Technologies section with completed refactoring metadata
- [x] T076 [P] Update `.claude/CLAUDE.md` Recent Changes section with refactoring summary
- [x] T077 Verify total line reduction: 649 → ~100 lines (85% reduction achieved)
- [x] T078 Verify zero duplication: Run manual comparison between README.md and CLAUDE.md
- [x] T079 Run final `/memory` command validation in Claude Code
- [x] T080 Delete backup file `.claude/CLAUDE.md.backup` if all validations pass
- [x] T081 Commit polish changes to `.claude/` repository
- [x] T082 Create pull request combining both commits (US2 + US3) in main repository

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: SKIPPED - no blocking prerequisites
- **User Story 1 (Phase 3)**: Can start immediately after Setup
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (README.md Development section must exist)
- **User Story 3 (Phase 5)**: Depends on User Story 2 completion (@ import pattern established)
- **Polish (Phase 6)**: Depends on User Story 3 completion

### User Story Dependencies

- **User Story 1 (P1)**: Independent - creates README.md Development section
- **User Story 2 (P2)**: Depends on US1 - references README.md via @ imports
- **User Story 3 (P3)**: Depends on US2 - builds on @ import pattern for rule files

### Within Each User Story

**User Story 1**:
- Tasks T006-T009 can run in parallel (different README.md sections)
- T010-T013 must run sequentially after content tasks complete

**User Story 2**:
- T014 must complete first (identifies duplicate content)
- T015-T023 can proceed sequentially (modifying same CLAUDE.md file)
- T024-T029 must run at end (validation)

**User Story 3**:
- T030-T033 can run in parallel (create different rule files)
- T034-T042 (Zod migration) run sequentially
- T043-T049 (TypeScript migration) run sequentially
- T050-T056 (Testing migration) run sequentially
- T034-T056 entire migration can run in parallel if using different editors/sessions
- T057-T063 (CLAUDE.md updates) run sequentially after migrations
- T064-T074 (validation) run sequentially at end

### Parallel Opportunities

- Phase 1: T001-T003 can run in parallel (independent verification tasks)
- User Story 1: T006-T009 can run in parallel (different README.md sections)
- User Story 2: All tasks modify same file, limited parallelization
- User Story 3: T030-T033 can run in parallel (create rule files)
- User Story 3: Pattern migrations (T034-T042, T043-T049, T050-T056) can run in parallel if staffed
- Polish: T075-T076 can run in parallel (different sections)

---

## Parallel Example: User Story 1

```bash
# Launch README.md section tasks in parallel (if using multiple editors):
Task: "Add Commands subsection to README.md"
Task: "Add Architecture subsection to README.md"
Task: "Add Testing subsection to README.md"
Task: "Add GitHub Actions subsection to README.md"
```

## Parallel Example: User Story 3

```bash
# Create all rule files in parallel:
Task: "Create .claude/rules/zod-patterns.md"
Task: "Create .claude/rules/typescript-patterns.md"
Task: "Create .claude/rules/testing-patterns.md"

# Migrate patterns in parallel (if using multiple editors):
Task: "Migrate Zod patterns (T034-T042)"
Task: "Migrate TypeScript patterns (T043-T049)"
Task: "Migrate Testing patterns (T050-T056)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Skip Phase 2: Foundational (no blocking prerequisites)
3. Complete Phase 3: User Story 1 (T004-T013)
4. **STOP and VALIDATE**: Verify README.md has comprehensive Development section
5. README.md now serves as single source of truth (MVP!)

### Incremental Delivery (Two-Commit Strategy per FR-014)

**Commit 1: US2 Implementation**
1. Complete Setup (Phase 1)
2. Complete US1 (Phase 3) - README.md enhanced
3. Complete US2 (Phase 4) - @ imports added, duplicates removed
4. Test independently: Verify @ imports via `/memory` command
5. Commit: "docs: refactor CLAUDE.md with @ imports and remove duplicates"
6. Validate: CLAUDE.md reduced from 649 to ~585 lines

**Commit 2: US3 Implementation**
1. Complete US3 (Phase 5) - Patterns migrated to modular rules
2. Test independently: Verify rule files via `/memory` command
3. Commit: "docs: migrate patterns to modular rules for on-demand loading"
4. Validate: CLAUDE.md reduced from ~585 to ~100 lines

**Final Pull Request**
1. Complete Polish (Phase 6)
2. Create PR with both commits
3. Total reduction: 649 → ~100 lines (85% token savings)

### Sequential Team Strategy

With single developer (recommended for documentation refactoring):

1. Week 1: Complete US1 (README.md enhancement) - 2-3 hours
2. Week 1: Complete US2 (@ imports + duplicate removal) - 2-3 hours
3. Week 2: Complete US3 (pattern migration) - 4-6 hours
4. Week 2: Complete Polish (validation) - 1-2 hours
5. Total effort: 9-14 hours over 2 weeks

---

## Notes

- [P] tasks = different files/sections, can run in parallel
- [Story] label maps task to specific user story (US1, US2, US3)
- Each user story should be independently testable via manual validation
- No automated tests: Manual validation via `/memory` command, line counts, spot-checking
- Commit after each user story (Principle VII: Incremental Commits)
- Two commits required: Commit 1 after US2, Commit 2 after US3 (per FR-014)
- Use conventional commit format: `docs: description`
- NEVER mention Claude, Claude Code, Anthropic, or AI tools in main repository files
- Stop at each checkpoint to validate story independently
- Preserve 100% technical accuracy during migration (FR-012)
- Maintain Prettier formatting throughout (FR-012)
- Verify @ imports use whole-file syntax only (FR-016)
