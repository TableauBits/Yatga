import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY_SONG, Song, User } from 'chelys';
import { SongGradeResult } from 'src/app/types/results';
import { getEmbedURL } from 'src/app/types/url';

interface GradeNavigatorInjectedData {
  songResults: SongGradeResult[],
  users: Map<string, User>,
  songs: Map<number, Song>
}

@Component({
  selector: 'app-grade-navigator',
  templateUrl: './grade-navigator.component.html',
  styleUrls: ['./grade-navigator.component.scss']
})
export class GradeNavigatorComponent {

  currentRank: number;
  currentSong: Song;
  currentSongSafeURL: SafeResourceUrl;

  results: SongGradeResult[];
  songs: Map<number, Song>;
  users: Map<string, User>;

  constructor(
    private sanitizer: DomSanitizer,
		private dialogRef: MatDialogRef<GradeNavigatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GradeNavigatorInjectedData
  ) {
    this.results = data.songResults;
    this.songs = data.songs;
    this.users = data.users;
    this.currentRank = data.songResults.length - 1;

    this.currentSong = this.songs.get(this.results[this.currentRank].id) || EMPTY_SONG;
    this.currentSongSafeURL = getEmbedURL(this.songs.get(this.currentSong.id) || EMPTY_SONG, this.sanitizer);
  }

  previousResultExist(): boolean {
    return this.currentRank - 1 >= 0;
  }

  nextResultExist(): boolean {
    return this.currentRank + 1 < this.results.length;
  }

  changeResult(shift: number): void {
    this.currentRank += shift;
    this.currentSong = this.songs.get(this.results[this.currentRank].id) || EMPTY_SONG;
    this.currentSongSafeURL = getEmbedURL(this.songs.get(this.currentSong.id) || EMPTY_SONG, this.sanitizer);
  }

  closeWindow(): void {
		this.dialogRef.close();
	}

}
