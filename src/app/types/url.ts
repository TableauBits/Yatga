import { Song, SongPlatform } from "chelys";
import * as URLParse from "url-parse";

export const DEFAULT_ID_FROM_URL = "i2-a5itIPy4";	// "X_dkdW3EG5Q" // "LmMfALLf1jo" // "dQw4w9WgXcQ";

const SOUNDCLOUD_URLs = ["soundcloud.com"];
const YOUTUBE_URLs = ["youtu.be", "www.youtube.com"];
const PEERTUBE_PATTERN = "/videos/watch/";
export const INVALID_URL = -1;

export function getIDFromURL(song: Song): string {
	switch (song.platform) {
		case SongPlatform.YOUTUBE: {
			const parsedURL = new URLParse(song.url, true);
			let videoID = DEFAULT_ID_FROM_URL;
			if (parsedURL.hostname === "youtu.be") { videoID = parsedURL.pathname.split("/")[1]; }
			if (parsedURL.hostname === "www.youtube.com") { videoID = parsedURL.query["v"] ?? ""; }
			return videoID;
		}
		case SongPlatform.PEERTUBE: return song.url.split("/videos/watch/").pop() ?? "";

		default: return "";
	}
}

export function URLToSongPlatform(url: string): SongPlatform {
	const hostname = new URLParse(url, true).hostname;
	if (YOUTUBE_URLs.includes(hostname)) return SongPlatform.YOUTUBE;
	else if (SOUNDCLOUD_URLs.includes(hostname)) return SongPlatform.SOUNDCLOUD;
	else if (url.includes(PEERTUBE_PATTERN)) return SongPlatform.PEERTUBE;
	return SongPlatform.INVALID_PLATFORM;
}
