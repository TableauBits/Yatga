import { Component, Input } from '@angular/core';
import { EMPTY_SONG, Song } from 'chelys';
import { isArray, isNil } from 'lodash';

type SongKey = keyof Song;
const OPTIONNAL_FIELDS: SongKey[] = ["album", "altTitles", "genres", "releaseYear"];

@Component({
  selector: 'app-optionnal-song-infos-button',
  templateUrl: './optionnal-song-infos-button.component.html',
  styleUrls: ['./optionnal-song-infos-button.component.scss']
})
export class OptionnalSongInfosButtonComponent {

  @Input() song: Song = EMPTY_SONG;

  constructor() { }

  convertToString(value: any): string {
    if (isNil(value)) return "/";
    if (isArray(value)) return value.join(", ");
    else return `${value}`;
  }

  isEmpty(): boolean {
    for (const field of OPTIONNAL_FIELDS) {
      if (!isNil(this.song[field])) return false;
    }
    return true;
  }

}
