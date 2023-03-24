import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';


export type CardSongExtended = {
  readonly videoId: string,
  readonly id: number,
  readonly songName: string,
  readonly artistName: string,
  readonly addedBy: string,
  liked: boolean,
  playing: boolean,
}

@Component({
  selector: 'app-song-card',
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.scss']
})
export class SongCardComponent {

  public toggle = false;

  @Input()
  public mysong = {
    videoId: '',
    id: 0,
    songName: '',
    artistName: '',
    addedBy: '',
    liked: false,
    playing: false,
  };

  @Output()
  public play = new EventEmitter<CardSongExtended>();

  constructor(
  ) { }

  playSong() {
    this.play.emit(this.mysong);
  }

  getMyShittyHQThumbnailUrlCSS(): string {
    return `url("https://img.youtube.com/vi/${this.mysong.videoId}/hqdefault.jpg")`;
  }
}
