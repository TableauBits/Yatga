import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Constitution, EMPTY_CONSTITUTION, EMPTY_USER, Song, User } from 'chelys';
import { isEmpty, isNil, max, min, range } from 'lodash';
import { CountryManagerService } from 'src/app/services/country-manager.service';
import { CalendarData, InvHistogramData } from 'src/app/types/charts';
import { mean, median } from 'src/app/types/math';
import { CONSTITUTION_USER_ID } from 'src/app/types/results';
import { LANGUAGES_CODE_TO_FR } from 'src/app/types/song-utils';
import { compareObjectsFactory, keepUniqueValues, toDecade } from 'src/app/types/utils';

type ReleaseYearSection = {
  histogramValues: number[];
  histogramColumns: number[];
  groupBy: number;
  mean: number;
  median: number;
}

type GenreTableData = {
  genre: string;
  count: number;
  users: Set<string>;
}

@Component({
  selector: 'app-results-constitution',
  templateUrl: './results-constitution.component.html',
  styleUrls: ['./results-constitution.component.scss']
})
export class ResultsConstitutionComponent implements OnChanges {

  @Input() users: Map<string, User> = new Map();
  @Input() constitution: Constitution = EMPTY_CONSTITUTION;
  @Input() songs: Map<number, Song> = new Map();

  resultsUsers: Map<string, User> = new Map();
  selectedUser: string;

  releaseYearSection: ReleaseYearSection;
  languagesInvHistogramData: InvHistogramData;
  countriesInvHistogramData: InvHistogramData;
  calendarData: CalendarData[] = [];
  genreTabeData: GenreTableData[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    const cstChange = changes["constitution"].currentValue as Constitution;
    this.resultsUsers.set(CONSTITUTION_USER_ID, {
      ...EMPTY_USER,
      uid: CONSTITUTION_USER_ID,
      displayName: cstChange.name,
    });

    const usersChange = changes["users"].currentValue as Map<string, User>;
    usersChange.forEach((value, key) => {
      this.resultsUsers.set(key, value);
    });

    this.generateHistogramData();
    this.generateLanguageData();
    this.generateCountriesData();
    this.generateCalendarData();
    this.generateGenreTableData();
  }

  constructor(public countryManager: CountryManagerService) {
    this.selectedUser = CONSTITUTION_USER_ID;
    this.releaseYearSection = {
      histogramValues: [],
      histogramColumns: [],
      groupBy: 10,
      mean: -1,
      median: -1
    };
    this.languagesInvHistogramData = {
      rows: [],
      values: [],
    };
    this.countriesInvHistogramData = {
      rows: [],
      values: [],
    };
  }

  getUserList(): User[] {
    return Array.from(this.resultsUsers.values());
  }

  getUser(uid: string): User {
    return this.users.get(uid) || EMPTY_USER;
  }

  getSelectedUser(): User {
    return this.resultsUsers.get(this.selectedUser) || EMPTY_USER;
  }

  newSelection(): void {
    this.generateHistogramData();
    this.generateLanguageData();
    this.generateCountriesData();
    this.generateGenreTableData();
  }

  songFilter(song: Song, property: keyof Song): boolean {
    // return true if the property isn't undefined and the song is from the selectedUser
    if (isNil(song[property])) return false;
    if (this.selectedUser === CONSTITUTION_USER_ID || this.selectedUser === song.user) return true;  // special case for the "constitution user" where we return all songs
    return false;
  }

  generateHistogramData(): void {
    let years = Array.from(this.songs.values())
      .filter(song => this.songFilter(song, "releaseYear"))
      .map(song => song.releaseYear) as number[];

    this.releaseYearSection.mean = Math.floor(mean(years));
    this.releaseYearSection.median = median(years);

    years = years.map(year => toDecade(year, this.releaseYearSection.groupBy));

    if (isEmpty(years)) {
      this.releaseYearSection.histogramColumns = [];
      this.releaseYearSection.histogramValues = [];
    };

    const minYear = min(years);
    const maxYear = max(years);

    if (isNil(minYear) || isNil(maxYear)) return;

    this.releaseYearSection.histogramColumns = range(minYear, maxYear + 1, this.releaseYearSection.groupBy);
    this.releaseYearSection.histogramValues = years;
  }

  generateLanguageData(): void {
    const rows: string[] = [];
    const values: number[] = [];

    const languages = Array.from(this.songs.values())
      .filter(song => this.songFilter(song, "languages"))
      .map(song => song.languages || [])
      .map(languages => {
        return languages.map(language => LANGUAGES_CODE_TO_FR.get(language)).sort().join(", ");
      })
      .sort()
      .reverse();

    for (const language of keepUniqueValues(languages)) {
      if (isNil(language)) return;
      rows.push(language);
      values.push(languages.filter(value => value === language).length);
    }

    // get the indexes of values sorted in descending order
    const sortedIndexes = values.map((_, i) => i).sort((a, b) => values[a] - values[b]);

    this.languagesInvHistogramData = {
      rows: sortedIndexes.map(i => rows[i]),
      values: sortedIndexes.map(i => values[i]),
      visualMap: {
        min: 0,
        max: languages.length,
        text: ["Beaucoup de musiques", "Peu de musiques",]
      }
    };
  }

  generateCountriesData(): void {
    const rows: string[] = [];
    const values: number[] = [];

    const countries = Array.from(this.songs.values())
      .filter(song => this.songFilter(song, "countries"))
      .map(song => song.countries || [])
      .map(countries => {
        return this.countryManager.getCountryName(countries.sort());
      })
      .sort()
      .reverse();

    for (const country of keepUniqueValues(countries)) {
      if (isNil(country)) return;
      rows.push(country);
      values.push(countries.filter(value => value === country).length);
    }

    // get the indexes of values sorted in descending order
    const sortedIndexes = values.map((_, i) => i).sort((a, b) => values[a] - values[b]);

    this.countriesInvHistogramData = {
      rows: sortedIndexes.map(i => rows[i]),
      values: sortedIndexes.map(i => values[i]),
      visualMap: {
        min: 0,
        max: countries.length,
        text: ["Beaucoup de musiques", "Peu de musiques",]
      }
    };
  }


  generateCalendarData(): void {
    const dates = Array.from(this.songs.values()).filter(song => song.addedDate).map(song => {
      const date = new Date(song.addedDate || "");
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
    });

    for (const date of keepUniqueValues(dates)) {
      this.calendarData.push([date, dates.filter(v => v === date).length]);
    }
  }

  generateGenreTableData(): void {
    const genreMap = new Map<string, GenreTableData>();
    this.songs.forEach(song => {
      if (!this.songFilter(song, "languages")) return;
      song.genres?.forEach(genre => {
        if (genreMap.has(genre)) {
          const data = genreMap.get(genre);
          if (isNil(data)) return;
          data.count += 1;
          data.users.add(song.user);
          genreMap.set(genre, data);
        } else {
          genreMap.set(genre, {
            genre,
            count: 1,
            users: new Set([song.user])
          });
        }
      });
    });
    this.genreTabeData = Array.from(genreMap.values()).sort(compareObjectsFactory("count", true));
  }

  propertyExists(property: keyof Song): boolean {
    return Array.from(this.songs.values()).findIndex((s) => { return !isNil(s[property]); }) !== -1;
  }

}
