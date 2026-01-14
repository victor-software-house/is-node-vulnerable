/**
 * Logging utility for debug output
 */

const isDebugEnabled = (): boolean => {
	return process.env.DEBUG === '1';
};

export function debug(message: string): void {
	if (isDebugEnabled()) {
		console.debug(`[DEBUG] ${message}`);
	}
}

export function error(message: string): void {
	console.error(`[ERROR] ${message}`);
}

export function info(message: string): void {
	console.log(message);
}

export function warn(message: string): void {
	console.warn(`[WARN] ${message}`);
}
