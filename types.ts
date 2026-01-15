/**
 * Type definitions for Node.js security checker
 */

import * as z from 'zod';

import type {
	releaseScheduleEntrySchema,
	releaseScheduleSchema,
	securityDatabaseSchema,
	vulnerabilityEntrySchema,
} from '@/schemas';

export type ReleaseSchedule = z.output<typeof releaseScheduleSchema>;
export type ReleaseScheduleEntry = z.output<typeof releaseScheduleEntrySchema>;
export type SecurityDatabase = z.output<typeof securityDatabaseSchema>;
export type VulnerabilityEntry = z.output<typeof vulnerabilityEntrySchema>;

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
