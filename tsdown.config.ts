import alias from '@rollup/plugin-alias';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsdown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	clean: true, // Clean dist before build
	dts: true, // Generate .d.ts files
	entry: ['index.ts'],
	format: ['esm'],
	minify: false, // Keep readable for debugging
	// @ts-expect-error - tsdown types don't include rollupPlugins yet, but it works
	rollupPlugins: [
		alias({
			entries: [{ find: '@', replacement: path.resolve(__dirname, '.') }],
		}),
	],
	treeshake: true, // Remove unused code
});
