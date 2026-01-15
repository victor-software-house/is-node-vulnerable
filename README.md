# Node.js Security Vulnerability Checker

TypeScript-based Node.js security vulnerability checker with Zod validation and bundled security data.

Based on [`is-my-node-vulnerable`](https://github.com/nodejs/is-my-node-vulnerable) but fully typed and properly structured.

## Features

- **TypeScript**: Full type safety with comprehensive type definitions
- **Zod Validation**: All external JSON data validated with Zod schemas
- **Bundled Data**: Security data included with package, no network calls at runtime
- **Daily Auto-Updates**: Data automatically updated via GitHub Actions
- **Platform-Specific**: Checks platform-specific vulnerabilities
- **Modular**: Clean separation of concerns

## Installation

```bash
npm install @victor-software-house/is-node-vulnerable
# or
pnpm add @victor-software-house/is-node-vulnerable
```

## Usage

### As CLI

```bash
# Check current Node.js version
npx @victor-software-house/is-node-vulnerable

# With debug output
DEBUG=1 npx @victor-software-house/is-node-vulnerable

# Skip check (emergency)
SKIP_NODE_SECURITY_CHECK=1 node index.js
```

### As Module

```typescript
import {
	isNodeVulnerable,
	isNodeEOL,
} from '@victor-software-house/is-node-vulnerable';

// Check if a specific version is vulnerable
const vulnerable = isNodeVulnerable('v20.10.0', 'darwin');
console.log(vulnerable); // false

// Check if a version is end-of-life
const isEOL = isNodeEOL('v16.0.0');
console.log(isEOL); // true
```

### In Package Scripts

```json
{
	"scripts": {
		"prebuild": "@victor-software-house/is-node-vulnerable",
		"check:security": "DEBUG=1 @victor-software-house/is-node-vulnerable"
	}
}
```

## API

### `isNodeVulnerable(version: string, platform?: Platform): boolean`

Check if a Node.js version is vulnerable to known CVEs.

**Parameters:**

- `version`: Node.js version (e.g., `"v20.10.0"`, `"18.0.0"`)
- `platform`: Optional platform (`"darwin"`, `"linux"`, `"win32"`, etc.)

**Returns:** `true` if vulnerable or EOL, `false` otherwise

### `isNodeEOL(version: string): boolean`

Check if a Node.js version is end-of-life.

**Parameters:**

- `version`: Node.js version (e.g., `"v16.0.0"`)

**Returns:** `true` if EOL, `false` otherwise

## Data Source

Security data is bundled with the package and automatically updated daily via GitHub Actions:

- **schedule.json**: Node.js release schedule from [nodejs/Release](https://github.com/nodejs/Release)
- **security.json**: CVE database from [nodejs/security-wg](https://github.com/nodejs/security-wg)

Data is synchronized daily at midnight UTC. For the latest security updates, use the most recent package version.

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

**Flat Module Structure**: All TypeScript files are in the root directory (no `src/` folder) for simplicity:

- `index.ts` - Entry point and public API exports
- `cli.ts` - CLI interface and user-facing output
- `vulnerability.ts` - Core CVE checking logic
- `schedule.ts` - Node.js EOL/release schedule checking
- `schemas.ts` - Zod validation schemas
- `types.ts` - TypeScript type definitions
- `logger.ts` - Colored console output utilities

**Import Aliases**: Always use `@/` aliases for imports, even for same-directory files. This is enforced by ESLint (`@dword-design/import-alias` plugin).

```typescript
// CORRECT
import { isNodeEOL } from '@/schedule';

// WRONG
import { isNodeEOL } from './schedule';
```

**Build System**: Uses `tsdown` (not `tsc`) to bundle into a single ESM file:

- Entry: `index.ts`
- Output: `dist/index.mjs` + `dist/index.d.mts`
- Bundle: All code + JSON data bundled together
- Format: ESM only (no CommonJS)
- Configuration: `tsdown.config.ts`

**Data Bundling**: Security data is bundled at build time using JSON imports with type assertion syntax. Files are validated with Zod schemas at runtime to ensure data integrity.

```typescript
import securityData from '@/data/security.json' with { type: 'json' };
import scheduleData from '@/data/schedule.json' with { type: 'json' };
```

### Testing

**Test Framework**: Vitest (Jest-compatible APIs with Vite integration). Test files are colocated with source files (e.g., `vulnerability.test.ts` next to `vulnerability.ts`).

**Key Features**:

- Type testing with `expectTypeOf` for compile-time type assertions
- Concurrent test execution with `.concurrent` for faster test suites
- Runtime type narrowing with `@tool-belt/type-predicates`
- ESM-first with top-level await support
- Smart watch mode (only reruns affected tests)
- Native code coverage

**Running Tests**:

```bash
pnpm test              # Run tests once
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
pnpm vitest file.test.ts  # Run specific test file
```

### GitHub Actions

Daily automation workflow (`.github/workflows/update-security-data.yml`):

1. Downloads latest `schedule.json` from [nodejs/Release](https://github.com/nodejs/Release)
2. Downloads latest `security.json` from [nodejs/security-wg](https://github.com/nodejs/security-wg)
3. Formats files with Prettier
4. Runs tests to validate data
5. If data changed:
   - Commits data changes
   - Bumps patch version
   - Creates git tag
   - Publishes to npm with provenance

Uses `[skip ci]` in commit messages to prevent recursive workflows.

## Exit Codes (CLI)

- `0` - Node.js version is secure
- `1` - Node.js version is vulnerable or EOL
- `2` - Check failed (unexpected error)

## Environment Variables

- `DEBUG=1` - Enable debug logging
- `SKIP_NODE_SECURITY_CHECK=1` - Skip security check (emergency use only)

## License

MIT © Victor Araújo

## Credits

Based on [`is-my-node-vulnerable`](https://github.com/nodejs/is-my-node-vulnerable) by Rafael Gonzaga.
