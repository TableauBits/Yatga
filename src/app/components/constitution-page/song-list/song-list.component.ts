import { Component, Input } from '@angular/core';
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

	@Input() songs: Map<number, Song>;
	@Input() users: Map<string, User>;

	cardsViewEnabled: boolean;
	cardsSort: 'asc' | 'dsc';

	constructor() {
		this.songs = new Map();
		this.users = new Map();

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

	getImageURL(song: Song): string {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const parsedURL = new URLParse(song.url, true);
				let videoID = "dQw4w9WgXcQ";
				console.log("url: ", parsedURL.hostname);
				if (parsedURL.hostname === "www.youtu.be") { videoID = parsedURL.pathname }
				if (parsedURL.hostname === "www.youtube.com") { console.log(parsedURL.query); videoID = parsedURL.query["v"] ?? "" }
				return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`
			}

			default: return "";
		}
	}

}
