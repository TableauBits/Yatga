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
  public playSong = new EventEmitter<CardSongExtended>();

  constructor(
  ) { }

  playSongReceive() {
    this.playSong.emit(this.mysong);
  }

  getHQThumbnailUrlCSS(): string {
    return `url("https://img.youtube.com/vi/${this.mysong.videoId}/hqdefault.jpg")`;
  }
}
