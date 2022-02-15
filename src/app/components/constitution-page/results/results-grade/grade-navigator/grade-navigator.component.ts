import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY_SONG, EMPTY_USER, Song, User, UserFavorites } from 'chelys';
import { SongGradeResult, UserGradeResults } from 'src/app/types/results';
import { getEmbedURL } from 'src/app/types/url';

interface GradeNavigatorInjectedData {
  songResults: SongGradeResult[],
  userResults: Map<string, UserGradeResults>,
  users: Map<string, User>,
  songs: Map<number, Song>,
  favorites: Map<string, UserFavorites>
}

interface VoteData {
  user: User,
  grade: number,
  score: number
}

function compareUserScore(v1: VoteData, v2: VoteData): number {
	if (v1.score > v2.score) return -1;
	if (v1.score < v2.score) return 1;
	return 0;
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

  userResults: Map<string, UserGradeResults> = new Map();
  songResults: SongGradeResult[];
  songs: Map<number, Song>;
  users: Map<string, User>;
  favorites: Map<string, UserFavorites>;

  constructor(
    private sanitizer: DomSanitizer,
		private dialogRef: MatDialogRef<GradeNavigatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GradeNavigatorInjectedData
  ) {
    this.songResults = data.songResults;
    this.userResults = data.userResults;
    this.songs = data.songs;
    this.users = data.users;
    this.favorites = data.favorites;
    this.currentRank = data.songResults.length - 1;

    this.currentSong = this.songs.get(this.songResults[this.currentRank].id) || EMPTY_SONG;
    this.currentSongSafeURL = getEmbedURL(this.songs.get(this.currentSong.id) || EMPTY_SONG, this.sanitizer);
  }

  getUser(uid: string): User {
    return this.users.get(uid) || EMPTY_USER;
  }

  getVotingUser(): VoteData[] {
    const users = [];
    for (const user of this.users.values()) {
      if (user.uid === this.currentSong.user) continue;
      const userData = this.userResults.get(user.uid);
      users.push({
        user,
        grade: userData?.data.values.get(this.currentSong.id) ?? -1,
        score: userData?.normalizeScores.get(this.currentSong.id) ?? 0
      });
    }
    return users.sort(compareUserScore);
  }

  getFavoriteForUser(): User[] {
    return Array.from(this.users.values()).filter((user) => {
      return this.favorites.get(user.uid)?.favs.includes(this.currentSong.id);
    });
  }

  previousResultExist(): boolean {
    return this.currentRank - 1 >= 0;
  }

  nextResultExist(): boolean {
    return this.currentRank + 1 < this.songResults.length;
  }

  changeResult(shift: number): void {
    this.currentRank += shift;
    this.currentSong = this.songs.get(this.songResults[this.currentRank].id) || EMPTY_SONG;
    this.currentSongSafeURL = getEmbedURL(this.songs.get(this.currentSong.id) || EMPTY_SONG, this.sanitizer);
  }

  closeWindow(): void {
		this.dialogRef.close();
	}

}
