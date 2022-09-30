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