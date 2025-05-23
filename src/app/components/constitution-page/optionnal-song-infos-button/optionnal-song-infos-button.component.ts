import { Component, Input } from '@angular/core';
import { EMPTY_SONG, Song } from 'chelys';
import { isArray, isNil } from 'lodash';
import { LANGUAGES_CODE_TO_FR } from 'src/app/types/song-utils';
import { getCountryData, getEmojiFlag, TCountryCode } from 'countries-list';

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

      const country = getCountryData(code);
      if (country) {
        return `${getEmojiFlag(code)} ${country.name}`;
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
