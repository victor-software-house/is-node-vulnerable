/**
 * Type definitions for Node.js security checker
 */

import * as z4 from 'zod/v4/core';

import type {
	releaseScheduleEntrySchema,
	releaseScheduleSchema,
	securityDatabaseSchema,
	vulnerabilityEntrySchema,
} from './schemas.js';

export type ReleaseSchedule = z4.output<typeof releaseScheduleSchema>;
export type ReleaseScheduleEntry = z4.output<typeof releaseScheduleEntrySchema>;
export type SecurityDatabase = z4.output<typeof securityDatabaseSchema>;
export type VulnerabilityEntry = z4.output<typeof vulnerabilityEntrySchema>;

export const PLATFORMS = [
	'aix',
	'android',
	'darwin',
	'freebsd',
	'linux',
	'openbsd',
	'sunos',
	'win32',
] as const;

export type Platform = (typeof PLATFORMS)[number];
