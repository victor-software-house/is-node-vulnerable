import { defineConfig } from 'tsdown';

export default defineConfig({
	// Built-in alias support
	alias: {
		'@': '.',
	},
	clean: true, // Clean dist before build
	dts: true, // Generate .d.ts files
	entry: ['index.ts'],
	format: ['esm'],
	minify: false, // Keep readable for debugging
	treeshake: true, // Remove unused code
});
