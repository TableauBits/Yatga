import { Injectable } from '@angular/core';
import { Song } from 'chelys';

@Injectable({
  providedIn: 'root'
})
export class SongPropertyManagerService {

  onNavigate(song: Song): void {
		window.open(song.url, "_blank");
	}

  getFeaturingList(feats: string[] | undefined): string {
    console.log(feats);
    if (!feats || feats.length === 0) return "";
    if (feats.length === 1) return feats[0];
    return feats.join(", ");
  }

  getTitle(song: Song): string {
    let title = song.title;
    if (song.altTitles) title += ` (${song.altTitles.join(" / ")})`;
    return title;
  }

  getSubTitle(song: Song): string {
    let subtitle = song.author;
    if (song.featuring) subtitle += ` feat. ${this.getFeaturingList(song.featuring)}`;
    if (song.album) subtitle += ` • ${song.album}`;
    if (song.releaseYear) subtitle += ` (${song.releaseYear})`;
    return subtitle;
  }
}
