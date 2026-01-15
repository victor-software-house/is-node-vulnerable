/**
 * Zod schemas for Node.js security data validation
 */

import * as z from 'zod';

export const vulnerabilityEntrySchema = z.object({
	affectedEnvironments: z.array(z.string()).optional(),
	cve: z.array(z.string()),
	description: z.string().optional(),
	overview: z.string().optional(),
	patched: z.string(),
	ref: z.string().optional(),
	severity: z.enum(['critical', 'high', 'low', 'medium', 'unknown']),
	vulnerable: z.string(),
});

export const securityDatabaseSchema = z.record(
	z.string(),
	vulnerabilityEntrySchema,
);

export const releaseScheduleEntrySchema = z.object({
	codename: z.string().optional(),
	end: z.string().optional(),
	lts: z.string().optional(),
	maintenance: z.string().optional(),
	start: z.string(),
});

export const releaseScheduleSchema = z.record(
	z.string(),
	releaseScheduleEntrySchema,
);
