import { Component, Input, OnInit } from '@angular/core';
import { ConstitutionMetadata, EMPTY_SONG, RewindRankSong, Song } from 'chelys';
import { GetUrlService } from 'src/app/services/get-url.service';

@Component({
  selector: 'app-song-card',
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.scss']
})
export class SongCardComponent implements OnInit {

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

  @Input()
  emoji: string = "";

  thumbnailURL = "";

  constructor(public urlGetter: GetUrlService) {

  }
  ngOnInit() {
    this.asyncGetImageURL().then(elem => this.thumbnailURL = elem);
  }

  async asyncGetImageURL(): Promise<string> {
    return `url(${await this.urlGetter.asyncGetImageURL(this.songInfo)})`;
  }

  getImageURL(): string {
    return `url(${this.urlGetter.getImageURL(this.songInfo)})`;
  }
}
