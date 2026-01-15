/**
 * CLI interface for Node.js security checker
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

import type { VulnerabilityEntry } from './types.js';

import { error, info } from './logger.js';
import { isNodeEOL } from './schedule.js';
import { securityDatabaseSchema } from './schemas.js';
import { checkPlatform, getVulnerabilityList } from './vulnerability.js';

// Find project root by looking for package.json
function findProjectRoot(startPath: string): string {
	let currentPath = startPath;
	while (currentPath !== path.dirname(currentPath)) {
		if (fs.existsSync(path.join(currentPath, 'package.json'))) {
			return currentPath;
		}
		currentPath = path.dirname(currentPath);
	}
	throw new Error('Could not find project root (package.json not found)');
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = findProjectRoot(__dirname);
const SECURITY_FILE = path.join(PROJECT_ROOT, 'data/security.json');

export function runCLI(): void {
	const nodeVersion = process.version;
	const platformString = process.platform;

	checkPlatform(platformString);
	const platform = platformString;

	info('Node.js Security Vulnerability Check\n');
	info(`Current Node.js version: ${nodeVersion}`);
	info(`Platform: ${platform}\n`);

	const isEOL = isNodeEOL(nodeVersion);

	if (isEOL) {
		error('[FAIL] Node.js version is end-of-life.\n');
		error(
			`${nodeVersion} is end-of-life. There are high chances of being vulnerable.`,
		);
		error('RECOMMENDED ACTION: Upgrade to a supported version.\n');
		process.exit(1);
	}

	const data = fs.readFileSync(SECURITY_FILE, 'utf-8');
	const securityDb = z.parse(securityDatabaseSchema, JSON.parse(data));

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
