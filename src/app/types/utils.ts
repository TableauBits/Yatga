import { toNumber } from "lodash";

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
