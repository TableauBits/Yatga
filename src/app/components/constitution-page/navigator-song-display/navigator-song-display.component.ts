import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY_SONG, Song } from 'chelys';
import { GetUrlService } from 'src/app/services/get-url.service';
import { SongPropertyManagerService } from 'src/app/services/song-property-manager.service';

@Component({
  selector: 'app-navigator-song-display',
  templateUrl: './navigator-song-display.component.html',
  styleUrls: ['./navigator-song-display.component.scss']
})
export class NavigatorSongDisplayComponent implements OnChanges {

  @Input() song: Song = EMPTY_SONG;
  songSafeURL: SafeResourceUrl = {};

  ngOnChanges(changes: SimpleChanges): void {
    this.songSafeURL = this.urlGetter.getEmbedURL(changes['song'].currentValue);
  }

  constructor(public urlGetter: GetUrlService, public songPropertyManager: SongPropertyManagerService) { }

}
