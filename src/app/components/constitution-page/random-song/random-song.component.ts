import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constitution, createMessage, FavReqAdd, FavReqRemove, FavResUpdate, EventType, extractMessageData, FAVORITES_MAX_LENGTH, Message, Song, UserFavorites, canModifyVotes } from 'chelys';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
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
export class RandomSongComponent implements OnDestroy {

	constitution: Constitution;
	currentSong: Song;
	currentSongSafeURL: SafeResourceUrl;
	songs: Song[];
	favorites: UserFavorites;

	constructor(
		private auth: AuthService,
		private sanitizer: DomSanitizer,
		private dialogRef: MatDialogRef<RandomSongComponent>,
		@Inject(MAT_DIALOG_DATA) public data: RandomSongInjectedData
	) {
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

	// TODO : DUPLICATION DE CODE

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
