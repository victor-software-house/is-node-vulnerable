/**
 * Node.js release schedule checking
 */

import { satisfies } from 'semver';

import type { ReleaseScheduleEntry } from './types.js';

import { CACHE_STORE, fetchWithCache } from './cache.js';
import { releaseScheduleSchema } from './schemas.js';

/**
 * Check if a Node.js version is end-of-life
 *
 * @param version - Node.js version (e.g., "v20.10.0", "18.0.0")
 * @returns True if the version is end-of-life, false otherwise
 * @throws Error if version information cannot be fetched
 *
 * @example
 * ```typescript
 * const isEOL = await isNodeEOL('v16.0.0');
 * console.log(isEOL); // true
 * ```
 */
export async function isNodeEOL(version: string): Promise<boolean> {
	const versionInfo = await getVersionInfo(version);

	if (versionInfo === null) {
		throw new Error(`Could not fetch version information for ${version}`);
	}

	// No end date means version is unreleased (not yet EOL)
	if (versionInfo.end === undefined) {
		return false;
	}

	const now = new Date();
	const endDate = new Date(versionInfo.end);

	return now > endDate;
}

async function getVersionInfo(
	version: string,
): Promise<null | ReleaseScheduleEntry> {
	const schedule = await fetchWithCache(
		CACHE_STORE.schedule,
		releaseScheduleSchema,
	);

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
