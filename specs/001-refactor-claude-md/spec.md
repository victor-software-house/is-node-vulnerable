# Feature Specification: CLAUDE.md Refactoring

**Feature Branch**: `001-refactor-claude-md`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "Refactor CLAUDE.md to use modular @ imports structure and eliminate duplication with README.md"

## User Scenarios & Testing

### User Story 1 - Enhanced README with Development Documentation (Priority: P1)

As a developer onboarding to the project, I need comprehensive development documentation in README.md so that I can understand the project architecture, available commands, and development workflow without needing to reference multiple files or AI-specific documentation.

**Why this priority**: This is the foundation for all other changes. The README must serve as the single source of truth for both human developers and AI assistants. Without this, the modular structure cannot be properly referenced.

**Independent Test**: Can be fully tested by having a new developer read only README.md and successfully set up the development environment, understand the architecture, and run all development commands without external guidance.

**Acceptance Scenarios**:

1. **Given** README.md with only installation and usage sections, **When** developer needs to understand development workflow, **Then** README contains comprehensive Development section with Commands, Architecture, Testing, and GitHub Actions subsections
2. **Given** development information scattered across CLAUDE.md, **When** developer reads README.md, **Then** all development information is consolidated in README with clear sections for Commands, Architecture, Testing, and GitHub Actions
3. **Given** README with new Development section, **When** AI assistant references project documentation, **Then** AI can import README content via @ syntax instead of duplicating information

---

### User Story 2 - Refactor CLAUDE.md with @ Imports (Priority: P2)

As an AI assistant working with the codebase, I need CLAUDE.md to use @ imports to reference README.md and other documentation so that I load only AI-specific guidance without duplicating project information, reducing token usage and maintaining a single source of truth.

**Why this priority**: This delivers the core refactoring benefit - eliminating 649 lines of duplication and establishing the @ import pattern. Must come after P1 (README enhancement) since it references that content.

**Independent Test**: Can be tested by loading CLAUDE.md in Claude Code and verifying that @ imports correctly pull content from README.md and package.json, resulting in smaller CLAUDE.md file (~585 lines vs 649 lines, with patterns retained for migration in US3).

**Acceptance Scenarios**:

1. **Given** monolithic 649-line CLAUDE.md, **When** refactored to use @ imports and remove duplicates, **Then** CLAUDE.md is reduced to ~585 lines with @ imports for README.md and package.json (AI-specific patterns retained for US3)
2. **Given** CLAUDE.md with @ imports, **When** loaded by Claude Code, **Then** all referenced content is automatically included without duplication
3. **Given** refactored CLAUDE.md, **When** project information changes in README, **Then** CLAUDE.md automatically reflects updates without manual synchronization
4. **Given** CLAUDE.md with AI-specific guidelines only, **When** loaded, **Then** development guidelines (import aliases, build system, CLI detection) remain in CLAUDE.md while project overview is imported

---

### User Story 3 - Modular Rules Structure (Priority: P3)

As an AI assistant processing TypeScript files with Zod schemas, I need topic-specific rules loaded on-demand from `.claude/rules/` directory so that I only load relevant pattern guidance (Zod, TypeScript, testing) when working with related files, optimizing token usage.

**Why this priority**: This is the optimization phase that delivers 50-70% token reduction for on-demand pattern loading. Can be implemented after core refactoring (P1, P2) is complete.

**Independent Test**: Can be tested by working on a TypeScript file with Zod schemas and verifying that only `zod-patterns.md` is loaded, not the entire set of patterns. Similarly, test that working on test files loads `testing-patterns.md` via path-specific rules.

**Acceptance Scenarios**:

1. **Given** large Zod v4 patterns section in CLAUDE.md, **When** moved to `.claude/rules/zod-patterns.md`, **Then** patterns are loaded on-demand when working with Zod schemas
2. **Given** TypeScript type safety patterns in CLAUDE.md, **When** moved to `.claude/rules/typescript-patterns.md`, **Then** patterns are loaded on-demand when working with TypeScript files
3. **Given** Vitest testing patterns in CLAUDE.md, **When** moved to `.claude/rules/testing-patterns.md` with path-specific frontmatter (`paths: ["**/*.test.ts"]`), **Then** patterns are loaded only when working with test files
4. **Given** modular rules structure, **When** AI assistant loads project context, **Then** default context is ~100 lines (CLAUDE.md) instead of 649 lines, with patterns available on-demand

---

### Edge Cases

- What happens when @ import references non-existent file? Claude Code should show clear error message indicating missing file.
- What happens when circular @ imports are created? Claude Code detects and handles circular imports (max depth: 5 hops per documentation).
- What happens when path-specific rules frontmatter uses invalid glob patterns? Patterns should fail gracefully and load rules unconditionally as fallback.
- What happens when README.md is updated but CLAUDE.md still references old section names? @ imports should reference section headers or file paths, not line numbers, to remain stable.
- What happens when rules need to be shared across multiple projects? `.claude/rules/` supports symlinks to shared rules directories (e.g., `~/.claude/shared-rules/`).

## Requirements

### Functional Requirements

- **FR-001**: README.md MUST contain a new Development section that includes Commands, Architecture, Testing, and GitHub Actions subsections (Configuration Repositories subsection removed per Principle VI: No AI Tool Mentions in Main Repository)
- **FR-002**: README.md Development section MUST include all development commands currently in CLAUDE.md (build, test, lint, format, typecheck)
- **FR-003**: README.md MUST include architecture overview with flat module structure, import aliases, build system, and data bundling information
- **FR-004**: CLAUDE.md MUST be refactored in two phases: from 649 lines to ~585 lines (US2: duplicates removed) using @ import syntax, then to ~100 lines (US3: patterns migrated to rules)
- **FR-005**: CLAUDE.md MUST retain AI-specific guidelines (import aliases, build system, CLI detection, future enhancements) that are not user-facing documentation
- **FR-006**: System MUST create `.claude/rules/` directory structure with three modular rule files: `zod-patterns.md`, `typescript-patterns.md`, and `testing-patterns.md`
- **FR-007**: Rule file `zod-patterns.md` MUST contain all Zod v4 best practices content (~250 lines) extracted from current CLAUDE.md
- **FR-008**: Rule file `typescript-patterns.md` MUST contain type safety patterns, runtime assertions, pattern matching, and functional utility library guidance (~150 lines)
- **FR-009**: Rule file `testing-patterns.md` MUST contain Vitest patterns, expectTypeOf usage, concurrent tests, and advantages over Jest (~100 lines)
- **FR-010**: Rule file `testing-patterns.md` MUST include path-specific frontmatter with `paths: ["**/*.test.ts", "**/*.spec.ts"]` for conditional loading
- **FR-011**: Refactored CLAUDE.md MUST use @ import syntax to reference rule files (e.g., `@.claude/rules/zod-patterns.md`)
- **FR-012**: All content migration MUST preserve exact technical details, code examples, and patterns from original CLAUDE.md
- **FR-013**: System MUST maintain backward compatibility - Claude Code must successfully load and parse all @ imports and path-specific rules

### Key Entities

- **README.md**: Primary user-facing documentation that serves as single source of truth for project overview, installation, usage, API, and development information
- **CLAUDE.md**: AI-specific memory file that provides Claude Code with guidelines and references via @ imports to avoid duplication
- **Rule Files**: Modular markdown files in `.claude/rules/` directory containing topic-specific technical patterns (Zod, TypeScript, testing)
- **@ Import References**: Syntax in CLAUDE.md that pulls content from other files (README.md, package.json, rule files) to eliminate duplication
- **Path-Specific Rules**: Rule files with YAML frontmatter containing `paths` field that conditionally loads rules based on file patterns being worked on

## Success Criteria

### Measurable Outcomes

- **SC-001**: CLAUDE.md file size reduced in two phases: from 649 lines to ~585 lines after US2 (duplicates removed), then to 90-110 lines after US3 (patterns migrated to rules, 85% total reduction)
- **SC-002**: Default context loaded by Claude Code reduced by 50-70% through modular rule structure with on-demand loading
- **SC-003**: README.md serves as complete standalone documentation - new developers can set up and understand project using only README
- **SC-004**: Zero duplication between README.md and CLAUDE.md - all shared content referenced via @ imports
- **SC-005**: Pattern-specific rules (Zod, TypeScript, testing) loaded only when working with relevant file types, verified by testing with path-specific file examples
- **SC-006**: All existing technical patterns and code examples preserved with 100% accuracy during migration
- **SC-007**: Claude Code successfully loads refactored structure using `/memory` command without errors
- **SC-008**: Token usage for pattern loading reduced to zero for contexts not requiring patterns (e.g., working on documentation loads ~100 lines, not ~649 lines)

## Assumptions

- Claude Code supports @ import syntax as documented in official documentation (https://code.claude.com/docs/en/memory.md)
- Claude Code correctly handles path-specific rules with YAML frontmatter and glob patterns
- Maximum @ import depth of 5 hops is sufficient for this project structure
- Current development documentation in CLAUDE.md is comprehensive and can be directly moved to README
- Modular rule structure will not require additional configuration beyond creating `.claude/rules/` directory
- Path-specific rule loading provides meaningful token savings for typical development workflows

## Dependencies

- Claude Code CLI must be up-to-date to support @ import syntax and path-specific rules features
- `.claude/` configuration repository must exist and be properly configured
- Git repository must have `.git/info/exclude` properly configured to exclude `.claude/` directory
- Prettier formatting must be maintained during content migration to preserve code block formatting

## Non-Goals

- This refactoring does NOT change the technical content or patterns themselves - only their organization
- This refactoring does NOT modify package.json or actual project configuration
- This refactoring does NOT create new development tooling or scripts (validation script wrapper remains planned future enhancement)
- This refactoring does NOT change the `.specify/` configuration structure
- This refactoring does NOT add new rules or patterns beyond what currently exists in CLAUDE.md
