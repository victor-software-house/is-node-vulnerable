/**
 * CLI interface for Node.js security checker
 */

import process from 'node:process';

import type { VulnerabilityEntry } from './types.js';

import { CACHE_STORE, fetchWithCache } from './cache.js';
import { error, info } from './logger.js';
import { isNodeEOL } from './schedule.js';
import { securityDatabaseSchema } from './schemas.js';
import { checkPlatform, getVulnerabilityList } from './vulnerability.js';

export async function runCLI(): Promise<void> {
	const nodeVersion = process.version;
	const platformString = process.platform;

	checkPlatform(platformString);
	const platform = platformString;

	info('Node.js Security Vulnerability Check\n');
	info(`Current Node.js version: ${nodeVersion}`);
	info(`Platform: ${platform}\n`);

	const isEOL = await isNodeEOL(nodeVersion);

	if (isEOL) {
		error('[FAIL] Node.js version is end-of-life.\n');
		error(
			`${nodeVersion} is end-of-life. There are high chances of being vulnerable.`,
		);
		error('RECOMMENDED ACTION: Upgrade to a supported version.\n');
		process.exit(1);
	}

	const securityDb = await fetchWithCache(
		CACHE_STORE.security,
		securityDatabaseSchema,
	);

	const vulnerabilities = getVulnerabilityList(
		nodeVersion,
		platform,
		securityDb,
	);

	if (vulnerabilities.length > 0) {
		error(
			`[VULNERABLE] Node.js ${nodeVersion} has ${vulnerabilities.length} known CVE(s):\n`,
		);

		for (const vuln of vulnerabilities) {
			error(`  ${formatVulnerability(vuln)}\n`);
		}

		error('RECOMMENDED ACTION: Upgrade to a patched version.\n');
		process.exit(1);
	}

	info(`[PASS] Node.js ${nodeVersion} has no known vulnerabilities.\n`);
	process.exit(0);
}

function formatVulnerability(vuln: VulnerabilityEntry): string {
	const severity =
		vuln.severity === 'unknown' ? '' : `(${vuln.severity.toUpperCase()})`;
	const cveList = vuln.cve.length > 0 ? vuln.cve.join(', ') : 'No CVE';
	const description = vuln.description ?? vuln.overview ?? 'No description';

	return [
		`${cveList} ${severity}`,
		`Description: ${description}`,
		`Patched versions: ${vuln.patched}`,
	].join('\n  ');
}
