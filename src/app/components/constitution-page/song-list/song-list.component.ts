import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { canModifySongs, Constitution, EMPTY_CONSTITUTION, EMPTY_USER, Song, SongPlatform, User } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY } from 'src/app/types/local-storage';
import { getEmbedURL, getIDFromURL } from 'src/app/types/url';
import { DeleteSongWarningComponent } from '../../delete-song-warning/delete-song-warning.component';
import { SongNavigatorComponent } from './song-navigator/song-navigator.component';

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

	@Input() constitution: Constitution;
	@Input() songs: Map<number, Song> = new Map();
	@Input() users: Map<string, User> = new Map();
	safeUrls: Map<number, SafeResourceUrl> = new Map();
	currentIframeSongID: number;

	cardsViewEnabled: boolean;
	cardsSortASC: boolean;

	constructor(
		private sanitizer: DomSanitizer,
		private auth: AuthService,
		private dialog: MatDialog
	) {
		this.constitution = EMPTY_CONSTITUTION;
		this.currentIframeSongID = -1;
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

	getImageURL(song: Song): string {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const videoID = getIDFromURL(song);
				return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
			}
		}
	}

	getSongSafeURL(song: Song): SafeResourceUrl {
		if (!this.safeUrls.has(song.id)) {
			this.safeUrls.set(song.id, getEmbedURL(song, this.sanitizer));
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
			cstId: this.constitution.id,
			song
		}

		this.dialog.open(DeleteSongWarningComponent, config);
	}

	openSongNavigator(song: Song): void {
		const config = new MatDialogConfig();

		config.data = {
			currentSong: song,
			songs: this.getSongs(),
		}

		this.dialog.open(SongNavigatorComponent, config);
		this.currentIframeSongID = -1;
	}

	canDeleteSong(): boolean {
		return canModifySongs(this.constitution);
	}

	updateCurrentIframeSong(song: Song): void {
		this.currentIframeSongID = song.id;
	}
}
