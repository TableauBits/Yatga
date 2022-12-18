import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Constitution, FavResUpdate, EventType, extractMessageData, Message, Song, UserFavorites } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { GetUrlService } from 'src/app/services/get-url.service';
import { YatgaUserFavorites } from 'src/app/types/extends/favorite';

const NEXT_SHIFT = 1;
const PREVIOUS_SHIFT = -1;

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
		public urlGetter: GetUrlService,
		private dialogRef: MatDialogRef<SongNavigatorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SongNavigatorInjectedData,
	) {
		super();

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

	keyPressed(keyEvent: KeyboardEvent): void {
    if (keyEvent.key === 'ArrowRight' && this.nextSongExist()) {
      this.changeSong(NEXT_SHIFT);
    }
    else if (keyEvent.key === 'ArrowLeft' && this.previousSongExist()) {
      this.changeSong(PREVIOUS_SHIFT);
    }
  }

	closeWindow(): void {
		this.dialogRef.close();
	}
}
