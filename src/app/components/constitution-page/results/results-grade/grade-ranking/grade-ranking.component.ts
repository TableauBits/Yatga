import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY_SONG, EMPTY_USER, Song, User } from 'chelys';
import { SongGradeResult } from 'src/app/types/results';
import * as confetti from 'canvas-confetti';
import { randomInRange } from 'src/app/types/math';
import { isNil } from 'lodash';
import { FIREWORK_DEFAULTS, FIREWORK_DURATION } from 'src/app/types/firework';
import { GetUrlService } from 'src/app/services/get-url.service';

@Component({
  selector: 'app-grade-ranking',
  templateUrl: './grade-ranking.component.html',
  styleUrls: ['./grade-ranking.component.scss']
})
export class GradeRankingComponent implements OnChanges {

  @ViewChild("fireworks") fireworksCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
  @Input() songResults: SongGradeResult[] = [];

  winner: Song = EMPTY_SONG;
  shouldLaunchFireworks: boolean = true;
  safeUrls: Map<number, SafeResourceUrl> = new Map();

  ngOnChanges(changes: SimpleChanges): void {
    this.songResults = changes['songResults'].currentValue;
    this.winner = this.getSongWinner();
  }

  constructor(public urlGetter: GetUrlService) {}

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

  getSongWinner(): Song {
    if (this.songResults.length < 1) return EMPTY_SONG;
    return this.songs.get(this.songResults[0].id) || EMPTY_SONG;
  }
  
  getWinnerScore(): string {
    if (isNil(this.songResults[0])) return '';
    const score = this.songResults[0].score;
    return isNil(score) ? '' : score.toFixed(5);
  }

  getUser(uid: string): User {
		return this.users.get(uid) || EMPTY_USER;
	}

  getSong(id: number): Song {
    return this.songs.get(id) || EMPTY_SONG;
  }

  getSongSafeURL(song: Song): SafeResourceUrl {
		if (!this.safeUrls.has(song.id)) {
			this.safeUrls.set(song.id, this.urlGetter.getEmbedURL(song));
		}
		return this.safeUrls.get(song.id) || '';
	}

  onNavigate(song: Song): void {
		window.open(song.url, "_blank");
	}

  empty(): Song {
    return EMPTY_SONG;
  }

}
