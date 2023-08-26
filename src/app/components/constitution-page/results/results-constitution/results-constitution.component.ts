import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Constitution, EMPTY_CONSTITUTION, EMPTY_USER, Song, User } from 'chelys';
import { flatten, isEmpty, isNil, max, min, range } from 'lodash';
import { CalendarData, PieData } from 'src/app/types/charts';
import { LANGUAGES_CODE_TO_FR } from 'src/app/types/song-utils';
import { keepUniqueValues } from 'src/app/types/utils';

const CONSTITUTION_USER_ID = "current-constitution";

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

  releaseYearHistogramValues: number[] = [];
  releaseYearHistogramColumns: number[] = [];
  releaseYearGroupBy: number;

  languagesPieData: PieData[] = [];

  calendarData: CalendarData[] = [];

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
    this.generatePieDate();
    this.generateCalendarData();
  }

  constructor() {
    this.selectedUser = CONSTITUTION_USER_ID;
    this.releaseYearGroupBy = 10;
  }

  getUserList(): User[] {
    return Array.from(this.resultsUsers.values());
  }

  getSelectedUser(): User {
    return this.resultsUsers.get(this.selectedUser) || EMPTY_USER;
  }

  newSelection(): void {
    this.generateHistogramData();
    this.generatePieDate();
  }

  songFilter(song: Song, property: keyof Song): boolean {
    // return true if the property isn't undefined and the song is from the selectedUser
    if (isNil(song[property])) return false;
    if (this.selectedUser === CONSTITUTION_USER_ID) return true;  // special case for the "constitution user" where we return all songs
    else if (this.selectedUser === song.user) return true;
    return false;
  }

  toDecade(year: number | undefined) {
    if (isNil(year)) return;
    return Math.floor((year) / this.releaseYearGroupBy) * this.releaseYearGroupBy;
  }

  generateHistogramData(): void {
    const years = Array.from(this.songs.values())
      .filter(song => this.songFilter(song, "releaseYear"))
      .map(song => this.toDecade(song.releaseYear)) as number[];

    if (isEmpty(years)) {
      this.releaseYearHistogramColumns = [];
      this.releaseYearHistogramValues = [];
    };

    const minYear = min(years);
    const maxYear = max(years);

    if (isNil(minYear) || isNil(maxYear)) return;

    this.releaseYearHistogramColumns = range(minYear, maxYear + 1, this.releaseYearGroupBy);
    this.releaseYearHistogramValues = years;
  }

  generatePieDate(): void {
    this.languagesPieData = [];
    const languages = flatten<string>(
      Array.from(this.songs.values())
      .filter(song => this.songFilter(song, "languages"))
      .map(song => song.languages || [])
      ).map(language => LANGUAGES_CODE_TO_FR.get(language));

    for (const language of keepUniqueValues(languages)) {
      if (isNil(language)) return;
      this.languagesPieData.push({
        name: language,
        value: languages.filter(value => value === language).length
      });
    }
  }

  generateCalendarData(): void {
    const dates = Array.from(this.songs.values()).filter(song => song.addedDate).map(song => {
      const date = new Date(song.addedDate || "");
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}`;
    });

    for (const date of keepUniqueValues(dates)) {
      this.calendarData.push([date, dates.filter(v => v === date).length]);
    }
  }

}
