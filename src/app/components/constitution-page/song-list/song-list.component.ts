import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { areResultsPublic, canModifySongs, Constitution, createMessage, CstFavReqAdd, CstFavReqRemove, EMPTY_CONSTITUTION, EMPTY_USER, EventType, FAVORITES_MAX_LENGTH, Song, SongPlatform, User, UserFavorites } from 'chelys';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY } from 'src/app/types/local-storage';
import { compareSongASC, compareSongDSC } from 'src/app/types/song';
import { getEmbedURL, getIDFromURL } from 'src/app/types/url';
import { DeleteSongWarningComponent } from '../../delete-song-warning/delete-song-warning.component';
import { SongNavigatorComponent } from './song-navigator/song-navigator.component';

@Component({
	selector: 'app-song-list',
	templateUrl: './song-list.component.html',
	styleUrls: ['./song-list.component.scss']
})
export class SongListComponent {

	@Input() constitution: Constitution;
	@Input() songs: Map<number, Song> = new Map();
	@Input() users: Map<string, User> = new Map();
	@Input() favorites: Map<string, UserFavorites> = new Map();

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

		if (this.cardsSortASC) return songs.sort(compareSongASC)
		else return songs.sort(compareSongDSC);
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
			song,
			cstId: this.constitution.id
		}

		this.dialog.open(DeleteSongWarningComponent, config);
	}

	openSongNavigator(song: Song): void {
		const config = new MatDialogConfig();

		config.data = {
			cstId: this.constitution.id,
			currentSong: song,
			songs: this.getSongs(),
			favorites: this.favorites.get(this.auth.uid)
		}

		this.dialog.open(SongNavigatorComponent, config);
		this.currentIframeSongID = -1;
	}

	canDeleteSong(): boolean {
		return canModifySongs(this.constitution);
	}

	canModifyFavorite(): boolean {
		return areResultsPublic(this.constitution);
	}

	updateCurrentIframeSong(song: Song): void {
		this.currentIframeSongID = song.id;
	}

	isAFavorite(song: Song): boolean {
		const userFavorites = this.favorites.get(this.auth.uid);
		if (isNil(userFavorites)) return false;
		return userFavorites.favs.includes(song.id);
	}

	toggleFavorite(song: Song): void {
		const userFavorites = this.favorites.get(this.auth.uid);
		if (isNil(userFavorites)) return;

		let message: string;

		if (userFavorites.favs.includes(song.id)) {
			// remove the song from favorites
			message = createMessage<CstFavReqRemove>(EventType.CST_FAV_remove, {cstId: this.constitution.id, songId: song.id});
		} else {
			// add the song to the favorites
			message= createMessage<CstFavReqAdd>(EventType.CST_FAV_add, {cstId: this.constitution.id, songId: song.id});
		}

		this.auth.ws.send(message);
	}

	noMoreFavorties(song: Song): boolean {
		const userFavorites = this.favorites.get(this.auth.uid);
		if (isNil(userFavorites)) return false;
		return FAVORITES_MAX_LENGTH === userFavorites.favs.length && !userFavorites.favs.includes(song.id);
	}
}
