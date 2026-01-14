/**
 * CLI interface for Node.js security checker
 */

import process from 'node:process';

import { CACHE_STORE, fetchWithCache } from './cache.js';
import { isNodeEOL } from './schedule.js';
import { securityDatabaseSchema } from './schemas.js';
import type {
   Platform,
   SecurityDatabase,
   VulnerabilityEntry,
} from './types.js';
import { getVulnerabilityList } from './vulnerability.js';

function formatVulnerability(vuln: VulnerabilityEntry): string {
   const severity =
      vuln.severity === 'unknown' ? '' : `(${vuln.severity.toUpperCase()})`;

   return [
      `${vuln.cve} ${severity}`,
      `Description: ${vuln.overview}`,
      `Patched versions: ${vuln.patched}`,
   ].join('\n  ');
}

export async function runCLI(): Promise<void> {
   const nodeVersion = process.version;
   const platform = process.platform as Platform;

   console.log('Node.js Security Vulnerability Check\n');
   console.log(`Current Node.js version: ${nodeVersion}`);
   console.log(`Platform: ${platform}\n`);

   const isEOL = await isNodeEOL(nodeVersion);

   if (isEOL) {
      console.error('[FAIL] Node.js version is end-of-life.\n');
      console.error(
         `${nodeVersion} is end-of-life. There are high chances of being vulnerable.`,
      );
      console.error('RECOMMENDED ACTION: Upgrade to a supported version.\n');
      process.exit(1);
   }

   const securityDb = await fetchWithCache<SecurityDatabase>(
      CACHE_STORE.security,
      securityDatabaseSchema,
   );

   const vulnerabilities = getVulnerabilityList(
      nodeVersion,
      securityDb,
      platform,
   );

   if (vulnerabilities.length > 0) {
      console.error(
         `[VULNERABLE] Node.js ${nodeVersion} has ${vulnerabilities.length} known CVE(s):\n`,
      );

      for (const vuln of vulnerabilities) {
         console.error(`  ${formatVulnerability(vuln)}\n`);
      }

      console.error('RECOMMENDED ACTION: Upgrade to a patched version.\n');
      process.exit(1);
   }

   console.log(`[PASS] Node.js ${nodeVersion} has no known vulnerabilities.\n`);
   process.exit(0);
}
