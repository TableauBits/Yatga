import { Component, Input } from '@angular/core';
import { EMPTY_SONG, Song } from 'chelys';
import { isArray, isNil } from 'lodash';
import { LANGUAGES_CODE_TO_FR } from 'src/app/types/song-utils';

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

  convertLanguagesToString(value: string[] | undefined): string {
    if (isNil(value)) return "/";
    return value.map(v => LANGUAGES_CODE_TO_FR.get(v) || "").join(", ");
  }

  isEmpty(): boolean {
    for (const field of OPTIONNAL_FIELDS) {
      if (!isNil(this.song[field])) return false;
    }
    return true;
  }

}
