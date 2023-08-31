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

  getSubTitle(song: Song, showYear: boolean = true): string {
    let subtitle = song.author;
    if (song.album) subtitle += ` • ${song.album}`;
    if (showYear && song.releaseYear) subtitle += ` (${song.releaseYear})`;
    return subtitle;
  }
}
