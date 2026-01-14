/**
 * Zod schemas for Node.js security data validation
 */

// eslint-disable-next-line no-restricted-imports -- scripts don't use project Zod extensions
import { z } from 'zod';

export const vulnerabilityEntrySchema = z.object({
   cve: z.string(),
   vulnerable: z.string(),
   patched: z.string(),
   severity: z.enum(['critical', 'high', 'medium', 'low', 'unknown']),
   overview: z.string(),
   affectedEnvironments: z.array(z.string()).optional(),
});

export const securityDatabaseSchema = z.record(vulnerabilityEntrySchema);

export const releaseScheduleEntrySchema = z.object({
   start: z.string(),
   end: z.string().optional(),
   lts: z.string().optional(),
   maintenance: z.string().optional(),
   codename: z.string().optional(),
});

export const releaseScheduleSchema = z.record(releaseScheduleEntrySchema);
