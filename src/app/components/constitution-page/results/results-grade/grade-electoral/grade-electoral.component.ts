import { Component, HostListener, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY_SONG, EMPTY_USER, Song, User, UserFavorites } from 'chelys';
import { SongGradeResult, UserGradeResults } from 'src/app/types/results';
import { getEmbedURL } from 'src/app/types/url';

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
  selector: 'app-grade-electoral',
  templateUrl: './grade-electoral.component.html',
  styleUrls: ['./grade-electoral.component.scss']
})
export class GradeElectoralComponent implements OnChanges {

  @HostListener('window:resize', [])
  onWindowResize() {
    this.iframeWidth = window.innerWidth / 3.5;
    this.iframeHeight =  this.iframeWidth / 16 * 9;
  }

  iframeHeight: number = 0;
  iframeWidth: number = 0;

  @Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
  @Input() favorites: Map<string, UserFavorites> = new Map();
  @Input() userResults: Map<string, UserGradeResults> = new Map();
  @Input() songResults: SongGradeResult[] = [];

  currentRank: number = 0;
  currentSong: Song = EMPTY_SONG;
  currentSongSafeURL: SafeResourceUrl = "";

  ngOnChanges(): void {
    this.currentRank = this.songResults.length - 1;
    this.currentSong = this.songs.get(this.songResults[this.currentRank].id) || EMPTY_SONG;
    this.currentSongSafeURL = getEmbedURL(this.songs.get(this.currentSong.id) || EMPTY_SONG, this.sanitizer);
  }

  constructor(private sanitizer: DomSanitizer) {
    this.onWindowResize();
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

}
