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
import { isNodeVulnerable, isNodeEOL } from '@victor-software-house/is-node-vulnerable';

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
