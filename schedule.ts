/**
 * Node.js release schedule checking
 */

import { satisfies } from 'semver';
import * as z from 'zod';

import type { ReleaseScheduleEntry } from '@/types';

import scheduleData from '@/data/schedule.json' with { type: 'json' };
import { releaseScheduleSchema } from '@/schemas';

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
	const schedule = z.parse(releaseScheduleSchema, scheduleData);

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
