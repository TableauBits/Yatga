import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Constitution, createMessage, FavReqAdd, FavReqRemove, FavResUpdate, EventType, extractMessageData, FAVORITES_MAX_LENGTH, Message, Song, UserFavorites, canModifyVotes } from 'chelys';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { GetUrlService } from 'src/app/services/get-url.service';

interface SongNavigatorInjectedData {
	constitution: Constitution,
	currentSong: Song,
	songs: Song[],
	favorites: UserFavorites
}

@Component({
	selector: 'app-song-navigator',
	templateUrl: './song-navigator.component.html',
	styleUrls: ['./song-navigator.component.scss']
})
export class SongNavigatorComponent implements OnDestroy {

	constitution: Constitution;
	currentSong: Song;
	currentSongSafeURL: SafeResourceUrl;
	songs: Song[];
	favorites: UserFavorites;

	constructor(
		private auth: AuthService,
		public urlGetter: GetUrlService,
		private dialogRef: MatDialogRef<SongNavigatorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SongNavigatorInjectedData,
	) {
		this.constitution = data.constitution;
		this.currentSong = data.currentSong;
		this.songs = data.songs;
		this.favorites = data.favorites;
		this.currentSongSafeURL = this.urlGetter.getEmbedURL(this.currentSong);

		this.auth.pushEventHandler(this.handleEvent, this);
	}

	ngOnDestroy(): void {
		this.auth.popEventHandler();
	}

	handleEvent(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;

		switch (message.event) {
			case EventType.CST_SONG_FAV_update: {
				const favorites = extractMessageData<FavResUpdate>(message).userFavorites;
				if (favorites.uid === this.auth.uid) this.favorites = favorites;
			}
		}
	}

	previousSongExist(): boolean {
		const index = this.songs.lastIndexOf(this.currentSong);
		return index - 1 >= 0;
	}

	nextSongExist(): boolean {
		const index = this.songs.lastIndexOf(this.currentSong);
		return index + 1 < this.songs.length;
	}

	changeSong(shift: number): void {
		const currentIndex = this.songs.lastIndexOf(this.currentSong);

		this.currentSong = this.songs[currentIndex + shift];
		this.currentSongSafeURL = this.urlGetter.getEmbedURL(this.currentSong);
	}

	closeWindow(): void {
		this.dialogRef.close();
	}

	isAFavorite(): boolean {
		if (isNil(this.favorites)) return false;
		return this.favorites.favs.includes(this.currentSong.id);
	}

	toggleFavorite(): void {
		if (isNil(this.favorites)) return;

		let message: string;

		if (this.favorites.favs.includes(this.currentSong.id)) {
			// remove the song from favorites
			message = createMessage<FavReqRemove>(EventType.CST_SONG_FAV_remove, { cstId: this.constitution.id, songId: this.currentSong.id });
		} else {
			// add the song to the favorites
			message = createMessage<FavReqAdd>(EventType.CST_SONG_FAV_add, { cstId: this.constitution.id, songId: this.currentSong.id });
		}

		this.auth.ws.send(message);
	}

	noMoreFavorties(): boolean {
		if (isNil(this.favorites)) return false;
		return FAVORITES_MAX_LENGTH === this.favorites.favs.length && !this.favorites.favs.includes(this.currentSong.id);
	}

	canModifyFavorite(): boolean {
		return canModifyVotes(this.constitution);
	}

}
