/**
 * Cache management for Node.js security data
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';
import * as z4 from 'zod/v4/core';

import type { CacheConfig } from './types.js';

import { debug, warn } from './logger.js';

const CACHE_DIR = path.join(os.homedir(), '.cache', 'node-security-checker');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
	fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export const CACHE_STORE = {
	schedule: {
		etagFile: path.join(CACHE_DIR, 'schedule.etag'),
		jsonFile: path.join(CACHE_DIR, 'schedule.json'),
		url: 'https://raw.githubusercontent.com/nodejs/Release/main/schedule.json',
	},
	security: {
		etagFile: path.join(CACHE_DIR, 'security.etag'),
		jsonFile: path.join(CACHE_DIR, 'security.json'),
		url: 'https://raw.githubusercontent.com/nodejs/security-wg/main/vuln/core/index.json',
	},
} as const;

const FETCH_TIMEOUT_MS = 10000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Fetch data with ETag-based caching and retry logic
 *
 * @param config - Cache configuration with URL and file paths
 * @param schema - Zod schema to validate the fetched data
 * @returns Validated data from cache or network
 * @throws Error if fetch fails and no cache is available
 */
export async function fetchWithCache<T extends z4.$ZodType>(
	config: CacheConfig,
	schema: T,
): Promise<z4.output<T>> {
	const cachedETag = loadCachedETag(config.etagFile);

	debug(`Fetching: ${config.url}`);

	try {
		const headResponse = await fetchWithRetry(
			{ method: 'HEAD' },
			MAX_RETRIES,
			config.url,
		);
		const upstreamETag = headResponse.headers.get('etag');

		if (
			upstreamETag !== null &&
			upstreamETag === cachedETag &&
			fs.existsSync(config.jsonFile)
		) {
			debug(`Using cached version: ${config.jsonFile}`);
			const cached = fs.readFileSync(config.jsonFile, 'utf-8');
			return z.parse(schema, JSON.parse(cached));
		}

		debug(`Downloading fresh data from ${config.url}`);
		const response = await fetchWithRetry({}, MAX_RETRIES, config.url);
		const data = await response.text();

		fs.writeFileSync(config.jsonFile, data, 'utf-8');

		if (upstreamETag !== null) {
			fs.writeFileSync(config.etagFile, upstreamETag, 'utf-8');
			debug(`Saved new ETag: ${upstreamETag}`);
		}

		return z.parse(schema, JSON.parse(data));
	} catch (error: unknown) {
		if (fs.existsSync(config.jsonFile)) {
			warn(`Network error, using stale cache: ${config.jsonFile}`);
			const cached = fs.readFileSync(config.jsonFile, 'utf-8');
			return z.parse(schema, JSON.parse(cached));
		}

		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Error(
			`Failed to fetch data and no cache available: ${errorMessage}`,
		);
	}
}

async function fetchWithRetry(
	options: RequestInit = {},
	retries = MAX_RETRIES,
	url: string,
): Promise<Response> {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const response = await fetchWithTimeout(url, options);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return response;
		} catch (error: unknown) {
			const isLastAttempt = attempt === retries;

			if (isLastAttempt) {
				throw error;
			}

			const errorMessage =
				error instanceof Error ? error.message : String(error);
			warn(
				`Fetch attempt ${attempt}/${retries} failed: ${errorMessage}. Retrying...`,
			);

			await sleep(RETRY_DELAY_MS * attempt);
		}
	}

	throw new Error('Failed after maximum retries');
}

async function fetchWithTimeout(
	url: string,
	options: RequestInit = {},
): Promise<Response> {
	const controller = new AbortController();
	const timeout = setTimeout(() => {
		controller.abort();
	}, FETCH_TIMEOUT_MS);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		return response;
	} finally {
		clearTimeout(timeout);
	}
}

function loadCachedETag(etagFile: string): null | string {
	if (fs.existsSync(etagFile)) {
		const etag = fs.readFileSync(etagFile, 'utf-8').trim();
		debug(`Loaded cached ETag: ${etag}`);
		return etag;
	}
	return null;
}

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
