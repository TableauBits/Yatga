import { Injectable } from '@angular/core';
import { Song } from 'chelys';

@Injectable({
  providedIn: 'root'
})
export class SongPropertyManagerService {

  onNavigate(song: Song): void {
		window.open(song.url, "_blank");
	}

  getFeaturingList(song: Song): string {
    if (!song.featuring || song.featuring.length === 0) return "";
    if (song.featuring.length === 1) return song.featuring[0];

    const last = song.featuring.pop();
    return `${song.featuring.join(", ")} & ${last}`;
  }

  getTitle(song: Song): string {
    let title = song.title;
    if (song.altTitles) title += ` (${song.altTitles.join(" / ")})`;
    return title;
  }

  getSubTitle(song: Song): string {
    let subtitle = song.author;
    if (song.featuring) subtitle += ` feat. ${this.getFeaturingList(song)}`;
    if (song.album) subtitle += ` • ${song.album}`;
    if (song.releaseYear) subtitle += ` (${song.releaseYear})`;
    return subtitle;
  }
}
