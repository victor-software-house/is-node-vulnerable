/**
 * Node.js release schedule checking
 */

import { satisfies } from 'semver';

import { CACHE_STORE, fetchWithCache } from './cache.js';
import { releaseScheduleSchema } from './schemas.js';
import type { ReleaseSchedule, ReleaseScheduleEntry } from './types.js';

async function getVersionInfo(
   version: string,
): Promise<ReleaseScheduleEntry | null> {
   const schedule = await fetchWithCache<ReleaseSchedule>(
      CACHE_STORE.schedule,
      releaseScheduleSchema,
   );

   const normalized = version.toLowerCase();
   if (schedule[normalized]) {
      return schedule[normalized];
   }

   for (const [key, value] of Object.entries(schedule)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- Type-safe: schedule validated by Zod
      if (satisfies(version, key)) {
         return value;
      }
   }

   return null;
}

export async function isNodeEOL(version: string): Promise<boolean> {
   const versionInfo = await getVersionInfo(version);

   if (!versionInfo) {
      throw new Error(`Could not fetch version information for ${version}`);
   }

   if (!versionInfo.end) {
      return true;
   }

   const now = new Date();
   const endDate = new Date(versionInfo.end);

   return now > endDate;
}
