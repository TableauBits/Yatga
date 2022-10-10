import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Song, SongPlatform } from 'chelys';
import { getIDFromURL } from '../types/url';

@Injectable({
  providedIn: 'root'
})
export class GetUrlService {
  constructor(private sanitizer: DomSanitizer) { }

  getEmbedURL(song: Song): SafeResourceUrl {
    switch (song.platform) {
      case SongPlatform.SOUNDCLOUD:
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://w.soundcloud.com/player/?url=${song.url}&visual=true`);
      case SongPlatform.YOUTUBE: {
        const videoID = getIDFromURL(song);
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://youtube.com/embed/${videoID}`);
      }
      default:
        return "";
    }
  }

  getImageURL(song: Song): string {
    switch (song.platform) {
      case SongPlatform.SOUNDCLOUD:
        return 'assets/soundcloud-card.jpg';
      case SongPlatform.YOUTUBE: {
        const videoID = getIDFromURL(song);
        return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
      }
      default:
        return "";
    }
  }
}
