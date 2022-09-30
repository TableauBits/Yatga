import { Injectable } from '@angular/core';
import { Song, SongPlatform } from 'chelys';
import { getIDFromURL } from '../types/url';

@Injectable({
  providedIn: 'root'
})
export class GetUrlService {

  constructor() { }

  getImageURL(song: Song): string {
    switch (song.platform) {
      case SongPlatform.YOUTUBE: {
        const videoID = getIDFromURL(song);
        return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
      }
      default:
        return "";
    }
  }
}
