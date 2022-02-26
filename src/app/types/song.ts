import { Song } from "chelys";

export function compareSongASC(s1: Song, s2: Song): number {
	if (s1.id > s2.id) return 1;
	if (s1.id < s2.id) return -1;
	return 0;
}

export function compareSongDSC(s1: Song, s2: Song): number {
	if (s1.id > s2.id) return -1;
	if (s1.id < s2.id) return 1;
	return 0;
}

export function compareSongUser(s1: Song, s2: Song): number {
	if (s1.user > s2.user) return -1;
	if (s1.user < s2.user) return 1;
	return 0;
}  