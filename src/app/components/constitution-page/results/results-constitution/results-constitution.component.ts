import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Constitution, EMPTY_CONSTITUTION, EMPTY_USER, Song, User } from 'chelys';
import { isEmpty, isNil, max, min, range } from 'lodash';

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

  ngOnChanges(changes: SimpleChanges): void {
    const usersChange = changes["users"].currentValue as Map<string, User>;

    usersChange.forEach((value, key) => {
      this.resultsUsers.set(key, value);
    });

    const cstChange = changes["constitution"].currentValue as Constitution;
    this.resultsUsers.set(CONSTITUTION_USER_ID, {
      ...EMPTY_USER,
      uid: CONSTITUTION_USER_ID,
      displayName: cstChange.name,
    });

    this.generateHistogramData();
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
  }

  yearFilter(song: Song): boolean {
    // return true if the year isn't unfedined and the song is from the selectedUser
    if (isNil(song?.releaseYear)) return false;
    if (this.selectedUser === CONSTITUTION_USER_ID) return true;  // special case for the constitution where we return all the songs
    else if (this.selectedUser === song.user) return true;
    return false;
  }

  toDecade(year: number | undefined) {
    if (isNil(year)) return;
    return Math.floor((year) / this.releaseYearGroupBy) * this.releaseYearGroupBy;
  }

  generateHistogramData(): void {
    const years = Array.from(this.songs.values())
      .filter(song => this.yearFilter(song))
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



}
