/**
 * Tests for data file validation
 * Ensures security.json and schedule.json conform to expected schemas
 */

import { assertIsDefined, assertIsString } from '@tool-belt/type-predicates';
import { describe, expect, it } from 'vitest';

import scheduleData from '@/data/schedule.json';
import securityData from '@/data/security.json';
import { releaseScheduleSchema, securityDatabaseSchema } from '@/schemas';

describe('Data Validation', () => {
	describe('security.json', () => {
		it('should conform to securityDatabaseSchema', () => {
			const result = securityDatabaseSchema.safeParse(securityData);

			if (!result.success) {
				console.error('Security data validation errors:', result.error.issues);
			}

			expect(result.success).toBe(true);
		});

		it('should have valid CVE entries', () => {
			// Use parse instead of safeParse - let it throw if invalid
			const result = securityDatabaseSchema.parse(securityData);

			// Check that we have at least some entries
			const entries = Object.keys(result);
			expect(entries.length).toBeGreaterThan(0);

			// Verify first entry has required fields
			const firstKey = entries[0];
			assertIsString(firstKey);

			const firstEntry = result[firstKey];
			assertIsDefined(firstEntry);

			expect(firstEntry).toHaveProperty('cve');
			expect(firstEntry).toHaveProperty('patched');
			expect(firstEntry).toHaveProperty('vulnerable');
			expect(firstEntry).toHaveProperty('severity');
		});
	});

	describe('schedule.json', () => {
		it('should conform to releaseScheduleSchema', () => {
			const result = releaseScheduleSchema.safeParse(scheduleData);

			if (!result.success) {
				console.error('Schedule data validation errors:', result.error.issues);
			}

			expect(result.success).toBe(true);
		});

		it('should have valid release entries', () => {
			// Use parse instead of safeParse - let it throw if invalid
			const result = releaseScheduleSchema.parse(scheduleData);

			// Check that we have at least some entries
			const versions = Object.keys(result);
			expect(versions.length).toBeGreaterThan(0);

			// Verify entries have start dates
			const firstKey = versions[0];
			assertIsString(firstKey);

			const firstVersion = result[firstKey];
			assertIsDefined(firstVersion);

			expect(firstVersion).toHaveProperty('start');
			expect(firstVersion.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});
	});
});
