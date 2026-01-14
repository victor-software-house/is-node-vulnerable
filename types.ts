/**
 * Type definitions for Node.js security checker
 */

export interface VulnerabilityEntry {
   cve: string;
   vulnerable: string; // semver range
   patched: string; // semver range
   severity: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
   overview: string;
   affectedEnvironments?: string[];
}

export interface SecurityDatabase {
   [cve: string]: VulnerabilityEntry;
}

export interface ReleaseScheduleEntry {
   start: string;
   end?: string;
   lts?: string;
   maintenance?: string;
   codename?: string;
}

export interface ReleaseSchedule {
   [version: string]: ReleaseScheduleEntry;
}

export interface CacheConfig {
   url: string;
   jsonFile: string;
   etagFile: string;
}

export const PLATFORMS = [
   'aix',
   'darwin',
   'freebsd',
   'linux',
   'openbsd',
   'sunos',
   'win32',
   'android',
] as const;

export type Platform = (typeof PLATFORMS)[number];
