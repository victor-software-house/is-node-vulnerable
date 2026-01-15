# Implementation Plan: CLAUDE.md Refactoring

**Branch**: `001-refactor-claude-md` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-refactor-claude-md/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor CLAUDE.md from a monolithic 649-line file to a modular structure using @ import syntax to reference README.md and topic-specific rule files in `.claude/rules/` directory. This eliminates duplication, reduces default context by 50-70%, and enables on-demand pattern loading based on file types being worked on. README.md will be enhanced with a comprehensive Development section to serve as the single source of truth for both human developers and AI assistants.

## Technical Context

**Language/Version**: Markdown (documentation refactoring), TypeScript 5.x (for validation)
**Primary Dependencies**: Claude Code CLI (@ import syntax, path-specific rules)
**Storage**: Filesystem-based (`.claude/` directory, independent git repository)
**Testing**: Manual verification via `/memory` command in Claude Code
**Target Platform**: Claude Code CLI v0.3.0+ (supports @ import and path-specific rules)
**Project Type**: Documentation refactoring (no source code changes)
**Performance Goals**: Reduce default context load from 649 lines to ~100 lines (85% reduction)
**Constraints**:
- @ import max depth: 5 hops (Claude Code limitation)
- Path-specific rules must use valid glob patterns
- All referenced files must exist in filesystem
- No circular @ imports permitted
**Scale/Scope**:
- Refactor 1 file (CLAUDE.md from 649 to ~100 lines)
- Enhance 1 file (README.md with Development section)
- Create 3 rule files (zod-patterns.md, typescript-patterns.md, testing-patterns.md)
- Total content migration: ~500 lines across modular structure

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Type Safety First
**PASS** - No TypeScript code changes in this refactoring. Documentation only.

### Principle II: Data Bundling & Offline-First
**PASS** - No data bundling changes. Documentation refactoring only.

### Principle III: Automated Quality Gates
**PASS** - No code changes requiring validation gates. Documentation quality verified manually via Claude Code `/memory` command.

### Principle IV: Simplicity & Single Responsibility
**PASS** - Refactoring reduces complexity by eliminating 649 lines of duplication and establishing modular structure. No feature creep.

**Justification**: This refactoring serves the simplicity principle by:
- Eliminating duplication between CLAUDE.md and README.md
- Reducing default context load by 85%
- Establishing single source of truth (README.md for project docs)
- Creating focused, topic-specific pattern files loaded on-demand

### Principle V: Test Coverage & Type Testing
**PASS** - No code changes requiring tests. Documentation quality verified via:
- Claude Code `/memory` command validates @ imports load correctly
- Manual testing of path-specific rules with relevant file types
- README.md serves as standalone documentation (human validation)

### Principle VI: Incremental Commits
**PASS** - Implementation plan includes incremental commit strategy:
- Task 1: Enhance README.md (commit)
- Task 2: Create `.claude/rules/` structure (commit)
- Task 3: Migrate patterns to rule files (commit)
- Task 4: Refactor CLAUDE.md with @ imports (commit)
- Task 5: Verify with `/memory` command (commit if changes needed)

**Constitutional Compliance**: ALL GATES PASS - No violations. Proceed to Phase 0.

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

### Documentation Structure (repository root)

```text
# Main repository documentation
README.md                    # Enhanced with Development section
CLAUDE.md                    # Refactored to ~100 lines with @ imports

# Claude Code configuration (independent git repo)
.claude/
├── CLAUDE.md               # Symlink to ../CLAUDE.md
├── settings.json           # Existing configuration
└── rules/                  # New modular pattern files
    ├── zod-patterns.md     # Zod v4 patterns (~250 lines)
    ├── typescript-patterns.md  # TypeScript patterns (~150 lines)
    └── testing-patterns.md     # Vitest patterns (~100 lines)
```

**Structure Decision**: Documentation-only refactoring with no source code changes. The `.claude/` directory is an independent git repository excluded from the main repo via `.git/info/exclude`. All pattern files are markdown with optional YAML frontmatter for path-specific rule loading.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations - all constitutional gates passed. This section is not applicable for this feature.

---

## Planning Phase Summary

### Phase 0: Outline & Research (Complete)

**Output**: `research.md` - All technical unknowns resolved

**Key Findings**:
1. Claude Code @ import syntax supports maximum 5 hops, circular import detection
2. Path-specific rules use YAML frontmatter with glob patterns
3. README Development section structure defined with 5 subsections
4. Content migration strategy established (three-phase approach)
5. Validation strategy using `/memory` command documented

**Research Questions Resolved**: 5/5
- Q1: @ import syntax behavior and limitations
- Q2: Path-specific rules implementation
- Q3: README Development section structure
- Q4: Content migration strategy
- Q5: Validation approach

---

### Phase 1: Design & Contracts (Complete)

**Outputs**:
- `data-model.md` - Documentation structure as data entities
- `contracts/README.md` - @ import resolution contracts and path-specific loading contracts
- `quickstart.md` - Step-by-step implementation guide
- Agent context updated in CLAUDE.md

**Key Designs**:
1. **Documentation Entities**: README.md, CLAUDE.md, three rule files (zod, typescript, testing)
2. **Relationships**: CLAUDE.md → README.md (@ import), CLAUDE.md → rule files (@ import)
3. **Validation Rules**: Content preservation, no duplication, standalone readability
4. **State Machine**: 6 states from Initial to Validated with rollback points
5. **Metrics**: 649 lines → ~100 lines (85% reduction), context load varies by use case

**Contracts Defined**: 6 contracts
- @ import resolution contract
- Path-specific rule loading contract
- Content preservation contract
- Single source of truth contract
- Performance contract (50-70% context reduction)
- Maintainability contract (update once, reflect everywhere)

---

### Phase 2: Task Generation (Not Started)

**Next Step**: Run `/speckit.tasks` command to generate implementation tasks from this plan.

**Expected Outputs**:
- `tasks.md` - Detailed implementation tasks with acceptance criteria
- Task breakdown following incremental commit strategy (Principle VI)
- Validation checkpoints after each task

---

## Implementation Readiness

**Status**: Ready to proceed to task generation

**Prerequisites Met**:
- [x] All research questions resolved
- [x] Data model defined with entities and relationships
- [x] Contracts documented with validation criteria
- [x] Quickstart guide written with step-by-step instructions
- [x] Agent context updated with feature technologies
- [x] Constitutional compliance verified (all gates pass)

**Artifacts Generated**:
- `/specs/001-refactor-claude-md/plan.md` (this file)
- `/specs/001-refactor-claude-md/research.md` (Phase 0 output)
- `/specs/001-refactor-claude-md/data-model.md` (Phase 1 output)
- `/specs/001-refactor-claude-md/quickstart.md` (Phase 1 output)
- `/specs/001-refactor-claude-md/contracts/README.md` (Phase 1 output)

**Branch**: `001-refactor-claude-md` (already created by setup script)

**Next Command**: `/speckit.tasks` to generate implementation tasks

---

**Plan Status**: Complete - Ready for task generation and implementation.
