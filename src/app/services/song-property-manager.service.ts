import { Injectable } from '@angular/core';
import { Song } from 'chelys';

@Injectable({
  providedIn: 'root'
})
export class SongPropertyManagerService {

  constructor() { }

  getTitle(song: Song): string {
    let title = song.title;
    if (song.altTitles) title += ` (${song.altTitles.join(" / ")})`;
    return title;
  }

  getSubTitle(song: Song): string {
    return song.album ? `${song.author} • ${song.album}` : song.author;
  }
}
