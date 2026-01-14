/**
 * Cache management for Node.js security data
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line no-restricted-imports -- scripts don't use project Zod extensions
import type { ZodSchema } from 'zod';

import type { CacheConfig } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.join(__dirname, '.cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
   fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export const CACHE_STORE = {
   security: {
      url: 'https://raw.githubusercontent.com/nodejs/security-wg/main/vuln/core/index.json',
      jsonFile: path.join(CACHE_DIR, 'security.json'),
      etagFile: path.join(CACHE_DIR, 'security.etag'),
   },
   schedule: {
      url: 'https://raw.githubusercontent.com/nodejs/Release/main/schedule.json',
      jsonFile: path.join(CACHE_DIR, 'schedule.json'),
      etagFile: path.join(CACHE_DIR, 'schedule.etag'),
   },
} as const;

function debug(msg: string): void {
   if (process.env.DEBUG === '1') {
      console.debug(`[DEBUG] ${msg}`);
   }
}

function loadCachedETag(etagFile: string): string | null {
   if (fs.existsSync(etagFile)) {
      const etag = fs.readFileSync(etagFile, 'utf-8').trim();
      debug(`Loaded cached ETag: ${etag}`);
      return etag;
   }
   return null;
}

export async function fetchWithCache<T>(
   config: CacheConfig,
   schema: ZodSchema<T>,
): Promise<T> {
   const cachedETag = loadCachedETag(config.etagFile);

   debug(`Fetching: ${config.url}`);

   try {
      const headResponse = await fetch(config.url, { method: 'HEAD' });

      if (!headResponse.ok) {
         throw new Error(
            `HEAD request failed with status ${headResponse.status}`,
         );
      }

      const upstreamETag = headResponse.headers.get('etag');

      if (
         upstreamETag &&
         upstreamETag === cachedETag &&
         fs.existsSync(config.jsonFile)
      ) {
         debug(`Using cached version: ${config.jsonFile}`);
         const cached = fs.readFileSync(config.jsonFile, 'utf-8');
         return schema.parse(JSON.parse(cached));
      }

      debug(`Downloading fresh data from ${config.url}`);
      const response = await fetch(config.url);

      if (!response.ok) {
         throw new Error(`GET request failed with status ${response.status}`);
      }

      const data = await response.text();

      fs.writeFileSync(config.jsonFile, data, 'utf-8');

      if (upstreamETag) {
         fs.writeFileSync(config.etagFile, upstreamETag, 'utf-8');
         debug(`Saved new ETag: ${upstreamETag}`);
      }

      return schema.parse(JSON.parse(data));
   } catch (error: unknown) {
      if (fs.existsSync(config.jsonFile)) {
         console.warn(
            `[WARN] Network error, using stale cache: ${config.jsonFile}`,
         );
         const cached = fs.readFileSync(config.jsonFile, 'utf-8');
         return schema.parse(JSON.parse(cached));
      }

      const errorMessage =
         error instanceof Error ? error.message : String(error);
      throw new Error(
         `Failed to fetch ${config.url} and no cache available: ${errorMessage}`,
      );
   }
}
