#!/usr/bin/env node
/**
 * Node.js Security Vulnerability Checker
 *
 * Based on is-my-node-vulnerable with proper TypeScript typing and caching.
 *
 * Caches vulnerability data locally in .cache/ directory to avoid repeated network requests.
 *
 * Usage:
 *   pnpm run check:node-security                    # Check with cache
 *   SKIP_NODE_SECURITY_CHECK=1 pnpm build           # Skip check (emergency)
 *   DEBUG=1 pnpm run check:node-security            # Enable debug output
 *
 * Exit codes:
 *   0 - Node.js version is secure
 *   1 - Node.js version is vulnerable or EOL
 *   2 - Check failed (unexpected error)
 */

import process from 'node:process';

import { runCLI } from './cli.js';

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
      console.warn(
         '[SKIP] Security check skipped (SKIP_NODE_SECURITY_CHECK=1)\n',
      );
      process.exit(0);
   }

   runCLI().catch((error: unknown) => {
      console.error('[ERROR] Security check failed:');
      console.error(error);
      process.exit(2);
   });
}
