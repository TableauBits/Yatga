import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY_USER, Song, SongPlatform, User } from '@tableaubits/hang';
import { AuthService } from 'src/app/services/auth.service';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY } from 'src/app/types/local-storage';
import * as URLParse from 'url-parse';
import { DeleteSongWarningComponent } from '../../delete-song-warning/delete-song-warning.component';

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

	@Input() cstId: string = "";
	@Input() songs: Map<number, Song> = new Map();
	@Input() users: Map<string, User> = new Map();
	safeUrls: Map<number, SafeResourceUrl> = new Map();

	cardsViewEnabled: boolean;
	cardsSortASC: boolean;

	constructor(
		private sanitizer: DomSanitizer, 
		private auth: AuthService,
		private dialog: MatDialog
	) {
		this.cardsViewEnabled = (localStorage.getItem(CARDS_VIEW_KEY) ?? true) === "true";
		this.cardsSortASC = (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "false";
	}

	getSongs(): Song[] {
		const songs = Array.from(this.songs.values());

		if (this.cardsSortASC) return songs.sort(compareConstitutionASC)
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

	getSongSafeURL(song: Song): SafeResourceUrl {
		if (!this.safeUrls.has(song.id)) {
			this.safeUrls.set(song.id, this.getEmbedURL(song));
		}
		
		return this.safeUrls.get(song.id) || '';
	}

	isCurrentUserSong(song: Song): boolean {
		return song.user === this.auth.uid;
	}

	onNavigate(song: Song): void {
    window.open(song.url, "_blank");
	}

	openDeleteSongWarning(song: Song): void {
		const config = new MatDialogConfig();

		config.data = {
			cstId: this.cstId,
			song
		}

		this.dialog.open(DeleteSongWarningComponent, config);
	}
}
