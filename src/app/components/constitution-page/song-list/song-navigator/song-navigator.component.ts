import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constitution, FavResUpdate, EventType, extractMessageData, Message, Song, UserFavorites } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { YatgaUserFavorites } from 'src/app/types/extends/favorite';
import { getEmbedURL } from 'src/app/types/url';

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
export class SongNavigatorComponent extends YatgaUserFavorites implements OnDestroy {

	constitution: Constitution;
	currentSong: Song;
	currentSongSafeURL: SafeResourceUrl;
	songs: Song[];
	favorites: UserFavorites;

	constructor(
		public auth: AuthService,
		private sanitizer: DomSanitizer,
		private dialogRef: MatDialogRef<SongNavigatorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SongNavigatorInjectedData,
	) {
		super();

		this.constitution = data.constitution;
		this.currentSong = data.currentSong;
		this.songs = data.songs;
		this.favorites = data.favorites;
		this.currentSongSafeURL = getEmbedURL(this.currentSong, this.sanitizer);

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
		this.currentSongSafeURL = getEmbedURL(this.currentSong, this.sanitizer);
	}

	closeWindow(): void {
		this.dialogRef.close();
	}

}
