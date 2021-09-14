import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY_USER, Song, SongPlatform, User } from '@tableaubits/hang';
import { CARDS_VIEW_KEY } from 'src/app/types/local-storage';
import * as URLParse from 'url-parse';

function compareConstitutionASC(s1: Song, s2: Song): number {
	if (s1.id > s2.id) return 1;
	if (s1.id < s2.id) return -1;
	return 0;
}

function compareConstitutionDSC(s1: Song, s2: Song): number {
	if (s1.id > s2.id) return -1;
	if (s1.id < s2.id) return 1;
	return 0;
}

@Component({
	selector: 'app-song-list',
	templateUrl: './song-list.component.html',
	styleUrls: ['./song-list.component.scss']
})
export class SongListComponent {

	@Input() songs: Map<number, Song> = new Map();
	@Input() users: Map<string, User> = new Map();

	cardsViewEnabled: boolean;
	cardsSort: 'asc' | 'dsc';

	constructor(private sanitizer: DomSanitizer) {

		this.cardsViewEnabled = (localStorage.getItem(CARDS_VIEW_KEY) ?? true) === "true";
		this.cardsSort = 'dsc';
	}

	getSongs(): Song[] {
		const songs = Array.from(this.songs.values());

		if (this.cardsSort === 'asc') return songs.sort(compareConstitutionASC)
		else return songs.sort(compareConstitutionDSC);
	}

	getUser(uid: string): User {
		return this.users.get(uid) || EMPTY_USER;
	}

	getIDFromURL(song: Song): string {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const parsedURL = new URLParse(song.url, true);
				let videoID = "i2-a5itIPy4"; // "X_dkdW3EG5Q" // "LmMfALLf1jo" // "dQw4w9WgXcQ";
				if (parsedURL.hostname === "youtu.be") { videoID = parsedURL.pathname.split("/")[1] }
				if (parsedURL.hostname === "www.youtube.com") { videoID = parsedURL.query["v"] ?? "" }
				return videoID;
			}

			default: return "";
		}
	}

	getImageURL(song: Song): string {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const videoID = this.getIDFromURL(song);
				return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
			}
		}
	}

	getEmbedURL(song: Song): SafeResourceUrl {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const videoID = this.getIDFromURL(song);
				return this.sanitizer.bypassSecurityTrustResourceUrl(`https://youtube.com/embed/${videoID}`);
			}

			default:
				return "";
		}
	}
}
