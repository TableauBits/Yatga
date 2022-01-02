import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY_SONG, EMPTY_USER, Song, SongPlatform, User } from 'chelys';
import { SongGradeResult } from 'src/app/types/results';
import { getEmbedURL, getIDFromURL } from 'src/app/types/url';
import * as confetti from 'canvas-confetti';
import { randomInRange } from 'src/app/types/math';

const FIREWORK_DURATION = 10000;
const FIREWORK_DEFAULTS = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999999999 };

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

  constructor(
    private sanitizer: DomSanitizer,
    ) {}

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

    this.shouldLaunchFireworks = !this.shouldLaunchFireworks
  }

  getSongWinner(): Song {
    if (this.songResults.length < 1) return EMPTY_SONG;
    return this.songs.get(this.songResults[0].id) || EMPTY_SONG;
  }

  getUser(uid: string): User {
		return this.users.get(uid) || EMPTY_USER;
	}

  getImageURL(song: Song): string {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const videoID = getIDFromURL(song);
				return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
			}
		}
	}

  getSongSafeURL(song: Song): SafeResourceUrl {
		if (!this.safeUrls.has(song.id)) {
			this.safeUrls.set(song.id, getEmbedURL(song, this.sanitizer));
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
