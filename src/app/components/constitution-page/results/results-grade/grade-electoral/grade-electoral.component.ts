import { Component, ElementRef, HostListener, Input, OnChanges, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY_SONG, EMPTY_USER, Song, User, UserFavorites } from 'chelys';
import { isNil } from 'lodash';
import { PieData } from 'src/app/types/charts';
import { mean, randomInRange } from 'src/app/types/math';
import { SongGradeResult, UserGradeResults } from 'src/app/types/results';
import * as confetti from 'canvas-confetti';
import { FIREWORK_DEFAULTS, FIREWORK_DURATION } from 'src/app/types/firework';
import { GetUrlService } from 'src/app/services/get-url.service';

const NEXT_RESULT = -1;
const PREVIOUS_RESULT = 1;

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

  @ViewChild("fireworks") fireworksCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
  @Input() favorites: Map<string, UserFavorites> = new Map();
  @Input() userResults: Map<string, UserGradeResults> = new Map();
  @Input() songResults: SongGradeResult[] = [];

  currentRank: number = 0;
  currentSong: Song = EMPTY_SONG;
  currentSongSafeURL: SafeResourceUrl = "";
  currentVoters: VoteData[] = [];
  iframeHeight: number = 0;
  iframeWidth: number = 0;
  shouldLaunchFireworks: boolean = true;
  pieData: PieData[] = [];
  selected: number = 0;
  range: number[] = [];

  ngOnChanges(): void {
    this.currentRank = this.songResults.length - 1;
    this.selected = this.currentRank;
    this.range = this.songResults.map((_, index) => index);
    this.currentSong = this.songs.get(this.songResults[this.currentRank].id) || EMPTY_SONG;
    this.currentSongSafeURL = this.urlGetter.getEmbedURL(this.songs.get(this.currentSong.id) || EMPTY_SONG);
    this.currentVoters = this.getVotingUser();
    this.generatePieData();
  }

  constructor(public urlGetter: GetUrlService) {
    this.onWindowResize();
  }

  launchFireworks() {
    const myConfetti = confetti.create(this.fireworksCanvas.nativeElement, {
      resize: true, // will fit all screen sizes
    });

    const animationEnd = Date.now() + FIREWORK_DURATION;

    const interval: any = setInterval(function(){
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / FIREWORK_DURATION);
      myConfetti(Object.assign({}, FIREWORK_DEFAULTS, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      myConfetti(Object.assign({}, FIREWORK_DEFAULTS, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      
    }, 250);

    this.shouldLaunchFireworks = !this.shouldLaunchFireworks;
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

  meanOfVotes(): number {
    const grades = this.currentVoters.map((v) => v.grade);
    return mean(grades);
  }

  previousResultExist(): boolean {
    return this.currentRank - 1 >= 0;
  }

  nextResultExist(): boolean {
    return this.currentRank + 1 < this.songResults.length;
  }

  isFirstResult(): boolean {
    return this.currentRank === 0;
  }

  isLastResult(): boolean {
    return this.currentRank === this.songResults.length - 1;
  }

  goToFirstResult(): void {
    this.currentRank = 0;
    this.changeResult(0);
  }

  goToLastResult(): void {
    this.currentRank = this.songResults.length - 1;
    this.changeResult(0);
  }

  goToResult(): void {
    this.changeResult(this.selected - this.currentRank);
  }

  changeResult(shift: number): void {
    this.currentRank += shift;
    if (this.currentRank === 0) this.launchFireworks();
    this.currentSong = this.songs.get(this.songResults[this.currentRank].id) || EMPTY_SONG;
    this.currentSongSafeURL = this.urlGetter.getEmbedURL(this.songs.get(this.currentSong.id) || EMPTY_SONG);
    this.currentVoters = this.getVotingUser();
    this.generatePieData();
  }

  generatePieData() {
    this.pieData = [];
    const data = new Map<string, PieData>();
    
    for (const user of this.users.keys()) {
      data.set(user, {name: user, value: 0});
    }

    const results = this.songResults.filter((_, index) => index >= this.currentRank);

    for (const result of results) {
      const user = this.songs.get(result.id)?.user;
      if (isNil(user)) continue;

        const count = data.get(user)?.value;
        data.set(user, {name: user, value: count ? count + 1 : 1});
    }

    this.pieData = Array.from(data.values()).map((v) => {
      const name = this.getUser(v.name).displayName;
      return {value: v.value, name};
    });
  }

  isBestQuartert(): boolean {
    return this.currentRank < this.songResults.length / 4;
  }

  keyPressed(keyEvent: KeyboardEvent): void {
    if (keyEvent.key === 'ArrowLeft' && !this.isFirstResult()) {
      this.changeResult(NEXT_RESULT);
    }
    else if (keyEvent.key === 'ArrowRight' && !this.isLastResult()) {
      this.changeResult(PREVIOUS_RESULT);
    }
  }

}
