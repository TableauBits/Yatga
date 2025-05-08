import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Song, SongPlatform } from 'chelys';
import { getIDFromURL } from '../types/url';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetUrlService {
  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  getEmbedURL(song: Song): SafeResourceUrl {
    switch (song.platform) {
      case SongPlatform.SOUNDCLOUD:
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://w.soundcloud.com/player/?url=${song.url}&visual=true`);
      case SongPlatform.YOUTUBE: {
        const videoID = getIDFromURL(song);
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://youtube.com/embed/${videoID}`);
      }
      case SongPlatform.PEERTUBE:
        return this.sanitizer.bypassSecurityTrustResourceUrl(song.url.replace("/videos/watch/", "/videos/embed/"));
      default:
        return "";
    }
  }

  getImageURL(song: Song): string {
    switch (song.platform) {
      case SongPlatform.YOUTUBE: {
        const videoID = getIDFromURL(song);

        return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
      }
      case SongPlatform.SOUNDCLOUD:
        return 'assets/soundcloud-card.jpg';
      case SongPlatform.PEERTUBE:
        return `${song.url.replace("/videos/watch/", "/lazy-static/previews/")}.jpg`;
      default:
        return "";
    }
  }

  async asyncGetImageURL(song: Song): Promise<String> {
    switch (song.platform) {
      case SongPlatform.YOUTUBE: {
        const videoID = getIDFromURL(song);

        let tnURL = `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
        try {
          await (this.http.head(tnURL, { observe: 'response' }).toPromise());
        } catch (error) {
          tnURL = `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
        }

        return tnURL;
      }
      case SongPlatform.SOUNDCLOUD:
        return 'assets/soundcloud-card.jpg';
      case SongPlatform.PEERTUBE:
        return `${song.url.replace("/videos/watch/", "/lazy-static/previews/")}.jpg`;
      default:
        return "";
    }
  }
}
