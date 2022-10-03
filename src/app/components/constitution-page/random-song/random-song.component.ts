import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constitution, FavResUpdate, EventType, extractMessageData, Message, Song, UserFavorites } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { YatgaUserFavorites } from 'src/app/types/extends/favorite';
import { getEmbedURL } from 'src/app/types/url';

interface RandomSongInjectedData {
	constitution: Constitution,
	songs: Song[],
	favorites: UserFavorites
}

@Component({
	selector: 'app-random-song',
	templateUrl: './random-song.component.html',
	styleUrls: ['./random-song.component.scss']
})
export class RandomSongComponent extends YatgaUserFavorites implements OnDestroy  {

	constitution: Constitution;
	currentSong: Song;
	currentSongSafeURL: SafeResourceUrl;
	songs: Song[];
	favorites: UserFavorites;

	constructor(
		public auth: AuthService,
		private sanitizer: DomSanitizer,
		private dialogRef: MatDialogRef<RandomSongComponent>,
		@Inject(MAT_DIALOG_DATA) public data: RandomSongInjectedData
	) {
		super();
		this.constitution = data.constitution;
		this.songs = data.songs;
		this.favorites = data.favorites;
		this.currentSong = this.songs[Math.floor(Math.random() * this.songs.length)];
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

	changeSong(): void {
		this.currentSong = this.songs[Math.floor(Math.random() * this.songs.length)];
		this.currentSongSafeURL = getEmbedURL(this.currentSong, this.sanitizer);
	}

	closeWindow(): void {
		this.dialogRef.close();
	}

}
