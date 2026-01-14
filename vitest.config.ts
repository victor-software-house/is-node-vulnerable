import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			exclude: ['**/*.config.*', 'dist/**', '**/*.d.ts'],
			include: ['*.ts'],
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
		},
		globals: true,
	},
});
