import { toNumber } from "lodash";

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function toMap<T, U>(obj: Record<string, unknown>): Map<T, U> {
	const map = new Map<T, U>();
	Object.entries(obj).forEach((entry) => {
		map.set(entry[0] as unknown as T, entry[1] as U);
	});

	return map;
}

export function toMapNumber<T>(obj: Record<string, unknown>): Map<number, T> {
	const map = new Map<number, T>();
	Object.entries(obj).forEach((entry) => {
		map.set(toNumber(entry[0]), entry[1] as T);
	});

	return map;
}

// Adapted from https://attacomsian.com/blog/javascript-generate-random-string
export function generateRandomString(length: number): string {
	let str = '';

	for (let i = 0; i < length; i++) {
		str += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
	}

	return str;
}
