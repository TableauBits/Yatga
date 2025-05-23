import { isNil, isObjectLike, toNumber } from "lodash";

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

export function removeElementFromArray<T>(element: T, array: T[]): T[] {
	const index = array.indexOf(element);

	if (index >= 0) {
		array.splice(index, 1);
	}
	return array;
}

export function capitalizeFirstLetter(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export function keepUniqueValues<T>(array: T[]): T[] {
	return [...new Set<T>(array)];
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

export function toDecade(year: number | undefined, groupBy: number = 10): number {
	if (isNil(year)) return -1;
	return Math.floor((year) / groupBy) * groupBy;
}

export function deepRecordConvert<T>(data: any, template: T): T {
	let sourceKey: keyof typeof data;
	for (sourceKey in data) {
		const targetKey = sourceKey as keyof T;

		let sourceField = data[sourceKey];
		let targetField = template[targetKey];
		if (!isNil(targetField) && isObjectLike(sourceField)) {
			// Depth-First
			sourceField = deepRecordConvert(sourceField, targetField);

			if (targetField instanceof Map) {
				data[sourceKey] = new Map(Object.entries(sourceField));
			}
		}
	}

	return data as T;
}