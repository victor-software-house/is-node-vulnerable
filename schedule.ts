/**
 * Node.js release schedule checking
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { satisfies } from 'semver';
import { z } from 'zod';

import type { ReleaseScheduleEntry } from './types.js';

import { releaseScheduleSchema } from './schemas.js';

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
const SCHEDULE_FILE = path.join(PROJECT_ROOT, 'data/schedule.json');

/**
 * Check if a Node.js version is end-of-life
 *
 * @param version - Node.js version (e.g., "v20.10.0", "18.0.0")
 * @returns True if the version is end-of-life, false otherwise
 * @throws Error if version information cannot be loaded
 *
 * @example
 * ```typescript
 * const isEOL = isNodeEOL('v16.0.0');
 * console.log(isEOL); // true
 * ```
 */
export function isNodeEOL(version: string): boolean {
	const versionInfo = getVersionInfo(version);

	if (versionInfo === null) {
		throw new Error(`Could not load version information for ${version}`);
	}

	// No end date means version is unreleased (not yet EOL)
	if (versionInfo.end === undefined) {
		return false;
	}

	const now = new Date();
	const endDate = new Date(versionInfo.end);

	return now > endDate;
}

function getVersionInfo(version: string): null | ReleaseScheduleEntry {
	const data = fs.readFileSync(SCHEDULE_FILE, 'utf-8');
	const schedule = z.parse(releaseScheduleSchema, JSON.parse(data));

	const normalized = version.toLowerCase();
	const directMatch = schedule[normalized];
	if (directMatch !== undefined) {
		return directMatch;
	}

	for (const [key, value] of Object.entries(schedule)) {
		if (satisfies(version, key)) {
			return value;
		}
	}

	return null;
}
