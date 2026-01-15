# ARCHIVED: Original Analysis Input

**Status**: Historical document - Pre-specification analysis
**Date**: 2026-01-15
**Purpose**: Preserved for reference only - DO NOT use as planning guidance

---

**IMPORTANT DISCLAIMER**

This document contains the original analysis that was used as INPUT to create the specification (spec.md). It includes implementation ideas and technical approaches that were intentionally EXCLUDED from the specification to maintain proper separation between requirements (WHAT) and implementation (HOW).

**Do not use this document to guide planning.** The planning phase should work exclusively from spec.md to avoid bias and ensure proper requirements-driven design.

This document is archived purely for historical reference and to preserve the original thinking that led to the specification.

---

# CLAUDE.md Refactoring Analysis

Based on Claude Code memory documentation at https://code.claude.com/docs/en/memory.md

## Current Issues

### 1. Significant Duplication
CLAUDE.md (649 lines) contains content that overlaps with or should be in README.md:
- Project overview duplicated
- API documentation exists in README but technical details scattered
- Development commands only in CLAUDE.md (should be in README!)

### 2. Missing Organizational Structure
- No use of `@` imports to reference existing documentation
- No modular `.claude/rules/` structure for topic-specific guidelines
- Single monolithic file instead of focused, importable modules

### 3. Content Mixing
CLAUDE.md mixes:
- User-facing documentation (should be in README)
- AI-specific technical patterns (belongs in CLAUDE.md)
- Deep technical details (could be modularized)

## Recommended Restructuring

### Phase 1: Enhance README.md

**Add to README.md:**

```markdown
## Development

### Commands

```bash
# Build the project (tsdown bundler)
pnpm build

# Quick check (run directly with tsx)
pnpm check

# Testing
pnpm test              # Run tests once
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage

# Linting and formatting
pnpm lint              # Check for issues
pnpm lint:fix          # Auto-fix issues
pnpm format            # Format all files
pnpm typecheck         # Type check without build

# Pre-publish check (runs automatically)
pnpm prepublishOnly    # Runs lint, typecheck, test, build
```

### Architecture

**Flat Module Structure**

All TypeScript files are in the root directory (no `src/` folder):
- `index.ts` - Entry point and public API exports
- `cli.ts` - CLI interface and user-facing output
- `vulnerability.ts` - Core CVE checking logic
- `schedule.ts` - Node.js EOL/release schedule checking
- `schemas.ts` - Zod validation schemas
- `types.ts` - TypeScript type definitions
- `logger.ts` - Colored console output utilities

**Import Aliases**: Always use `@/` aliases for imports:
```typescript
import { isNodeEOL } from '@/schedule';
import type { Platform } from '@/types';
```

**Build System**: Uses `tsdown` (not `tsc`) to bundle into a single ESM file.

**Data Bundling**: Security data bundled at build time using JSON imports. All data validated with Zod schemas at runtime.

### Testing

Uses Vitest with test files colocated with source files.

### GitHub Actions

Daily automated workflow:
1. Downloads latest security data from nodejs/Release and nodejs/security-wg
2. Validates data with tests
3. If changed: commits, bumps version, tags, publishes to npm with provenance

### Configuration Repositories

This project has two configuration directories that are separate git repositories:
- `.claude/` - Claude Code configuration (GitHub: `victor-software-house/is-node-vulnerable.claude-config`)
- `.specify/` - Specify configuration (GitHub: `victor-software-house/is-node-vulnerable.specify-config`)

Both excluded via `.git/info/exclude` with independent version control.

## Contributing

[Add contributing guidelines here]
```

### Phase 2: Refactor CLAUDE.md

**New CLAUDE.md structure (uses @ imports):**

```markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

@README.md - See README for complete project overview, installation, usage, and API documentation.

@package.json - Available npm scripts for development.

## Configuration Repositories

This project has configuration directories as separate git repositories:
- `.claude/` - Claude Code configuration (GitHub: `victor-software-house/is-node-vulnerable.claude-config`)
- `.specify/` - Specify configuration (GitHub: `victor-software-house/is-node-vulnerable.specify-config`)

Both excluded via `.git/info/exclude`.

## Development Guidelines

### Import Aliases

ALWAYS use `@/` aliases for imports, even for same-directory files:

```typescript
// CORRECT
import { isNodeEOL } from '@/schedule';

// WRONG
import { isNodeEOL } from './schedule';
```

Enforced by ESLint (`@dword-design/import-alias` with `aliasForSubpaths: true`).

### Build System

Uses `tsdown` bundler. Entry: `index.ts`, Output: `dist/index.mjs` + `dist/index.d.mts`.
Configuration: `tsdown.config.ts`

## Technical Patterns

### Zod Validation
See @.claude/rules/zod-patterns.md for comprehensive Zod v4 patterns.

### TypeScript Type Safety
See @.claude/rules/typescript-patterns.md for type safety patterns and functional utilities.

### Testing
See @.claude/rules/testing-patterns.md for Vitest patterns and best practices.

### CLI Detection

`index.ts` detects CLI execution by checking import.meta.url:

```typescript
if (
  import.meta.url.endsWith('/index.ts') ||
  import.meta.url.endsWith('/index.mjs') ||
  import.meta.url.endsWith('/index')
) {
  runCLI();
}
```

## Future Enhancements

### Validation Script Wrapper

**Status**: Planned (not yet implemented)

**Purpose**: Token-efficient validation workflow for large error counts (Constitution Principle III)

**Location**: `scripts/validate.sh`

**Planned functionality**:
```bash
validate lint          # Run linting
validate typecheck     # Run type checking
validate test          # Run tests
validate build         # Run build
validate all           # Run all gates

# Token-efficient options (planned)
validate typecheck --silent   # Save to /tmp/validation-*.log
validate typecheck --count    # Display error count only
```

**When to implement**: After observing workflow pain points. Current manual approach (`pnpm typecheck > /tmp/typecheck.log 2>&1`) sufficient for now.

**Reference**: `.specify/memory/constitution.md` Principle III
```

### Phase 3: Create Modular Rules

**`.claude/rules/zod-patterns.md`:**
- All Zod v4 best practices content
- Type inference patterns
- Parsing strategies
- Advanced validation patterns
- Deprecated patterns to avoid
- Common anti-patterns

**`.claude/rules/typescript-patterns.md`:**
- Type safety patterns
- Runtime assertions
- Pattern matching with ts-pattern
- Functional utility libraries (Remeda, ts-belt, Radash)
- noUncheckedIndexedAccess patterns

**`.claude/rules/testing-patterns.md`:**
- Vitest patterns
- expectTypeOf for type testing
- Runtime assertions in tests
- Concurrent tests
- Coverage strategies

## Benefits of This Structure

### 1. Eliminates Duplication
- Single source of truth for project info (README)
- No need to maintain same content in multiple files
- `@` imports automatically pull latest content

### 2. Improves Organization
- Topic-specific rules in separate files
- Easy to find relevant guidelines
- Modular structure scales better

### 3. Better Developer Experience
- README serves both users and developers
- CLAUDE.md focused on AI-specific patterns
- Clear separation of concerns

### 4. Reduces Token Usage
- Conditional rules only loaded when relevant files accessed
- No loading massive pattern guides unless needed
- Path-specific rules: `paths: ["**/*.test.ts"]` for test patterns

### 5. Easier Maintenance
- Update documentation in one place
- Rules can be shared across projects (symlinks)
- Clear ownership of content

## Implementation Priority

**High Priority** (Do Now):
1. Add development section to README.md
2. Convert CLAUDE.md to use `@README.md` import
3. Move Zod patterns to `.claude/rules/zod-patterns.md`

**Medium Priority** (Next):
4. Move TypeScript patterns to `.claude/rules/typescript-patterns.md`
5. Move testing patterns to `.claude/rules/testing-patterns.md`

**Low Priority** (Later):
6. Add path-specific rules with frontmatter where applicable
7. Consider symlinking common rules from ~/.claude/rules/

## Example: Path-Specific Rules

```markdown
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# Testing Patterns

Use Vitest with expectTypeOf for type testing...
```

Only loaded when Claude works with test files, saving tokens in other contexts.

## Token Savings Estimate

Current: ~649 lines always loaded
After refactoring:
- Core CLAUDE.md: ~100 lines (always loaded)
- Zod patterns: ~250 lines (loaded on-demand)
- TypeScript patterns: ~150 lines (loaded on-demand)
- Testing patterns: ~100 lines (loaded on-demand, path-specific)

**Estimated savings**: 50-70% reduction in default context, with patterns available when needed.

## Migration Checklist

- [ ] Backup current CLAUDE.md
- [ ] Add Development section to README.md
- [ ] Create `.claude/rules/` directory
- [ ] Create `zod-patterns.md` rule
- [ ] Create `typescript-patterns.md` rule
- [ ] Create `testing-patterns.md` rule
- [ ] Refactor CLAUDE.md to use @ imports
- [ ] Test with `/memory` command to verify structure
- [ ] Commit changes to respective repositories
