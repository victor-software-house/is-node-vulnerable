# Node.js Security Vulnerability Checker

TypeScript-based Node.js security vulnerability checker with Zod validation and local caching.

Based on [`is-my-node-vulnerable`](https://github.com/nodejs/is-my-node-vulnerable) but fully typed and properly structured.

## Features

- **TypeScript**: Full type safety with comprehensive type definitions
- **Zod Validation**: All external JSON data validated with Zod schemas
- **ETag Caching**: Efficient HTTP caching with ETag support
- **Stale Cache Fallback**: Uses cached data on network failures
- **Platform-Specific**: Checks platform-specific vulnerabilities
- **Modular**: Clean separation of concerns

## Installation

```bash
npm install @victor-software-studio/node-security-checker
# or
pnpm add @victor-software-studio/node-security-checker
```

## Usage

### As CLI

```bash
# Check current Node.js version
npx node-security-checker

# With debug output
DEBUG=1 npx node-security-checker

# Skip check (emergency)
SKIP_NODE_SECURITY_CHECK=1 node index.js
```

### As Module

```typescript
import {
	isNodeVulnerable,
	isNodeEOL,
} from '@victor-software-studio/node-security-checker';

// Check if a specific version is vulnerable
const vulnerable = await isNodeVulnerable('v20.10.0', 'darwin');
console.log(vulnerable); // false

// Check if a version is end-of-life
const isEOL = await isNodeEOL('v16.0.0');
console.log(isEOL); // true
```

### In Package Scripts

```json
{
	"scripts": {
		"prebuild": "node-security-checker",
		"check:security": "DEBUG=1 node-security-checker"
	}
}
```

## API

### `isNodeVulnerable(version: string, platform?: Platform): Promise<boolean>`

Check if a Node.js version is vulnerable to known CVEs.

**Parameters:**

- `version`: Node.js version (e.g., `"v20.10.0"`, `"18.0.0"`)
- `platform`: Optional platform (`"darwin"`, `"linux"`, `"win32"`, etc.)

**Returns:** `true` if vulnerable or EOL, `false` otherwise

### `isNodeEOL(version: string): Promise<boolean>`

Check if a Node.js version is end-of-life.

**Parameters:**

- `version`: Node.js version (e.g., `"v16.0.0"`)

**Returns:** `true` if EOL, `false` otherwise

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
