import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Song } from 'chelys';
import { getEmbedURL } from 'src/app/types/url';

interface SongNavigatorInjectedData {
	currentSong: Song,
	songs: Song[]
}

@Component({
	selector: 'app-song-navigator',
	templateUrl: './song-navigator.component.html',
	styleUrls: ['./song-navigator.component.scss']
})
export class SongNavigatorComponent {

	currentSong: Song;
	currentSongSafeURL: SafeResourceUrl;
	songs: Song[];

	constructor(
		private sanitizer: DomSanitizer,
		private dialogRef: MatDialogRef<SongNavigatorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SongNavigatorInjectedData,
	) {
		this.currentSong = data.currentSong;
		this.songs = data.songs;
		this.currentSongSafeURL = getEmbedURL(this.currentSong, this.sanitizer);
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
