import { Component, Input } from '@angular/core';
import { EMPTY_SONG, Song } from 'chelys';
import { isArray, isNil } from 'lodash';
import { LANGUAGES_CODE_TO_FR } from 'src/app/types/song-utils';
import { getEmojiFlag, TCountryCode } from 'countries-list';
import { COUNTRY_CODES_TO_NAME } from 'src/app/types/country';

type SongKey = keyof Song;
const OPTIONNAL_FIELDS: SongKey[] = ["album", "genres", "releaseYear", "languages", "countries"];

@Component({
  selector: 'app-optionnal-song-infos-button',
  templateUrl: './optionnal-song-infos-button.component.html',
  styleUrls: ['./optionnal-song-infos-button.component.scss']
})
export class OptionnalSongInfosButtonComponent {

  @Input() song: Song = EMPTY_SONG;
  @Input() isButtonRaised = true;

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

  convertCountriesToString(value: string[] | undefined): string {
    if (isNil(value)) return "/";
    return value.map(v => {
      const code = v as TCountryCode;
      const name = COUNTRY_CODES_TO_NAME.get(code);
      if (name) {
        return `${getEmojiFlag(code)} ${name}`;
      } else {
        return v;
      }
    }
    ).join(", ");
  }

  isEmpty(): boolean {
    for (const field of OPTIONNAL_FIELDS) {
      if (!isNil(this.song[field])) return false;
    }
    return true;
  }

}
