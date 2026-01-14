#!/usr/bin/env node
/**
 * Node.js Security Vulnerability Checker
 *
 * Based on is-my-node-vulnerable with proper TypeScript typing and caching.
 *
 * Caches vulnerability data locally in ~/.cache/node-security-checker/ to avoid repeated network requests.
 *
 * Usage:
 *   pnpm run check                              # Check with cache
 *   SKIP_NODE_SECURITY_CHECK=1 pnpm build       # Skip check (emergency)
 *   DEBUG=1 pnpm run check                      # Enable debug output
 *
 * Exit codes:
 *   0 - Node.js version is secure
 *   1 - Node.js version is vulnerable or EOL
 *   2 - Check failed (unexpected error)
 */

import process from 'node:process';

import { runCLI } from './cli.js';
import { error, warn } from './logger.js';

// Re-export public API
export { isNodeEOL } from './schedule.js';
export type {
	Platform,
	ReleaseSchedule,
	ReleaseScheduleEntry,
	SecurityDatabase,
	VulnerabilityEntry,
} from './types.js';
export { isNodeVulnerable } from './vulnerability.js';

// CLI execution when run directly
if (
	import.meta.url.endsWith('/index.ts') ||
	import.meta.url.endsWith('/index.js')
) {
	if (process.env.SKIP_NODE_SECURITY_CHECK === '1') {
		warn('[SKIP] Security check skipped (SKIP_NODE_SECURITY_CHECK=1)\n');
		process.exit(0);
	}

	runCLI().catch((err: unknown) => {
		error('[ERROR] Security check failed:');
		console.error(err);
		process.exit(2);
	});
}
