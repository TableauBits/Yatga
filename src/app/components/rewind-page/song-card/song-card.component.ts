import { Component, Input } from '@angular/core';
import { ConstitutionMetadata, EMPTY_SONG, RewindRankSong, Song } from 'chelys';
import { GetUrlService } from 'src/app/services/get-url.service';

@Component({
  selector: 'song-card',
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.scss']
})
export class SongCardComponent {

  @Input()
  songInfo: Song = EMPTY_SONG;

  @Input()
  songStats: RewindRankSong = {
    id: '',
    rank: 0,
    score: 0,
    mean_score: 0
  };

  @Input()
  associatedCstStats: ConstitutionMetadata = {
    name: "",
    nSongs: 0,
  };

  constructor(public urlGetter: GetUrlService) { }

  getImageURL(): string {
    return `url(${this.urlGetter.getImageURL(this.songInfo)})`;
  }
}
