#!/usr/bin/env node
/**
 * Node.js Security Vulnerability Checker
 *
 * Based on is-my-node-vulnerable with proper TypeScript typing and bundled security data.
 *
 * Security data is bundled with the package and updated daily via GitHub Actions.
 *
 * Usage:
 *   pnpm run check                              # Check current Node.js version
 *   SKIP_NODE_SECURITY_CHECK=1 pnpm build       # Skip check (emergency)
 *   DEBUG=1 pnpm run check                      # Enable debug output
 *
 * Exit codes:
 *   0 - Node.js version is secure
 *   1 - Node.js version is vulnerable or EOL
 *   2 - Check failed (unexpected error)
 */

import process from 'node:process';

import { runCLI } from '@/cli';
import { error, warn } from '@/logger';

// Re-export public API
export { isNodeEOL } from '@/schedule';
export type {
	Platform,
	ReleaseSchedule,
	ReleaseScheduleEntry,
	SecurityDatabase,
	VulnerabilityEntry,
} from '@/types';
export { isNodeVulnerable } from '@/vulnerability';

// CLI execution when run directly
if (
	import.meta.url.endsWith('/index.ts') ||
	import.meta.url.endsWith('/index.mjs') ||
	import.meta.url.endsWith('/index')
) {
	if (process.env.SKIP_NODE_SECURITY_CHECK === '1') {
		warn('[SKIP] Security check skipped (SKIP_NODE_SECURITY_CHECK=1)\n');
		process.exit(0);
	}

	try {
		runCLI();
	} catch (err: unknown) {
		error('[ERROR] Security check failed:');
		console.error(err);
		process.exit(2);
	}
}
