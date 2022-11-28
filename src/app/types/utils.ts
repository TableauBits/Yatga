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

/**
 * Creates a function that compares two objects by a given key.
 * @template T The type of the objects to compare.
 * @param key The key of the objects T to compare or a function that returns the key.
 * @param invert If true, the comparison will be inverted
 * @returns A function that compares two objects by a given key
 * @example
 * const compare = compareObjectsFactory<Song>("name", false);
 * const songs = [song3, song2, song1];
 * songs.sort(compare);
 * // songs = [song1, song2, song3]
 * @example
 * const compare = compareObjectsFactory<Song>(song => song.name, false);
 * const songs = [song3, song2, song1];
 * songs.sort(compare);
 * // songs = [song1, song2, song3]
 */
 export function compareObjectsFactory<T>(key: keyof T | ((arg: T) => any), invert: boolean): (o1: T, o2: T) => number {
	return (o1: T, o2: T) => {
		const v1 = typeof key === "function" ? key(o1) : o1[key];
		const v2 = typeof key === "function" ? key(o2) : o2[key];
		if (v1 > v2) return invert ? -1 : 1;
		if (v1 < v2) return invert ? 1 : -1;
		return 0;
	};
}