import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { EMPTY_SONG, EMPTY_USER, Song, User } from 'chelys';
import { flatten, isNil, range, toNumber } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { GetUrlService } from 'src/app/services/get-url.service';
import { EMPTY_SCATTER_CONFIG, ScatterConfig, ScatterData } from 'src/app/types/charts';
import { mean, variance } from 'src/app/types/math';
import { SongGrade, UserGradeResults } from 'src/app/types/results';
import { GRADE_VALUES, LANGUAGES_CODE_TO_FR } from 'src/app/types/song-utils';
import { keepUniqueValues } from 'src/app/types/utils';

type UserGrade = {
  uid: string;
  songId: number;
  grade: number;
  normalizeScore: number;
}

type MinMaxGrades = {
  min: UserGrade;
  max: UserGrade;
}

@Component({
  selector: 'app-grade-grades',
  templateUrl: './grade-grades.component.html',
  styleUrls: ['./grade-grades.component.scss']
})
export class GradeGradesComponent implements OnChanges {
  readonly GRADE_VALUES = GRADE_VALUES;

  @Input() songs: Map<number, Song> = new Map();
  @Input() users: Map<string, User> = new Map();
  @Input() userResults: Map<string, UserGradeResults> = new Map();

  selectedSong: string;

  histogramValues: number[] = [];
  selectedUser: string;
  selectedUserMean: number = 0;
  selectedUserVar: number = 0;

  languagesScatterConfig: ScatterConfig = EMPTY_SCATTER_CONFIG;

  minMaxGrades: MinMaxGrades;

  ngOnChanges(changes: SimpleChanges): void {
    this.userResults = changes['userResults'].currentValue;
    this.generateHistogramValues();   // Init values
    this.generateScatterInfos();
    this.generateMinMaxGrades();
  }

  constructor(private auth: AuthService, public urlGetter: GetUrlService) {
    this.selectedUser = auth.uid;
    this.selectedSong = '-1';
    this.minMaxGrades = {
      max: {uid: "", songId: -1, normalizeScore: 0, grade: -1},
      min: {uid: "", songId: -1, normalizeScore: 0, grade: -1}
    };
  }

  getSongList(): Song[] {
    return Array.from(this.songs.values());
  }

  getSong(id: number): Song {
    return this.songs.get(id) ?? EMPTY_SONG;
  }

  getSelectedSong(): Song {
    const id = toNumber(this.selectedSong);
    return this.songs.get(id) ?? EMPTY_SONG;
  }

  getImageURL(): string {
    const song = this.getSelectedSong();
    return this.urlGetter.getImageURL(song);
	}

  returnVote(uid: string): number | string {
    return this.userResults.get(uid)?.data.values.get(toNumber(this.selectedSong)) ?? '/';
  }

  returnScore(uid: string): number | string {
    return this.userResults.get(uid)?.normalizeScores.get(toNumber(this.selectedSong))?.toFixed(4) ?? '/';
  }

  getUser(uid: string): User {
    return this.users.get(uid) ?? EMPTY_USER;
  }

  getSelectedUser(): User {
    return this.users.get(this.selectedUser) ?? EMPTY_USER;
  }

  getSelectedUserSong(): SongGrade[] {
    const userResult = this.userResults.get(this.selectedUser);
    if (isNil(userResult)) return [];
    let songs: SongGrade[] = [];
    userResult.data.values.forEach((value, key) => {
      songs.push({
        song: this.songs.get(key) ?? EMPTY_SONG,
        grade: value
      });
    });
   
    return songs.sort((a, b) => b.grade - a.grade);
  }

  getUserList(): User[] {
    return Array.from(this.users.values());
  }

  generateHistogramValues(): void {
    const userResult = this.userResults.get(this.selectedUser);
    if (isNil(userResult)) return;
    this.histogramValues = Array.from(userResult.data.values.values());
    this.selectedUserMean = mean(this.histogramValues);
    this.selectedUserVar = variance(this.selectedUserMean, this.histogramValues);
  }

  newSelection(): void  {
    this.generateHistogramValues();
    this.generateScatterInfos();
  }

  generateScatterInfos(): void {
    // Init
    this.languagesScatterConfig = EMPTY_SCATTER_CONFIG;
    const languages = keepUniqueValues(flatten(this.getSongList()
      .filter(s => !isNil(s.languages))
      .map(s => s.languages)
    ));

    const songs = this.getSongList().filter(s => s.user !== this.selectedUser); // Only keep song that the selected user have a vote for
    const votes = this.userResults.get(this.selectedUser)?.data.values;

    // Config
    this.languagesScatterConfig = {
      axisMax: 10,
      bubbleSizeMultiplier: 15,
      data: flatten(languages.map((language, index) => {
        let scatterPoints: ScatterData[] = [];
        range(1, 11).forEach(grade => {
          const count = songs.filter(s => s.languages?.includes(language ?? "") && votes?.get(s.id) === grade).length;
          if (count === 0) return;
          scatterPoints.push([index, grade-1, count]);  // grade-1 because index should start at 0
        });
        return scatterPoints;
      })),
      names: languages.map(language => LANGUAGES_CODE_TO_FR.get(language ?? "") ?? "")
    };
  }

  generateMinMaxGrades(): void {
    let maxGrade: UserGrade =  {uid: "", songId: -1, normalizeScore: 0, grade: -1};
    let minGrade: UserGrade = {uid: "", songId: -1, normalizeScore: Infinity, grade: -1};
    this.users.forEach(user => {
      const result = this.userResults.get(user.uid);
      if (isNil(result)) return;
      this.songs.forEach(song => {
        const score = result.normalizeScores.get(song.id);
        if (isNil(score)) return;
        if (maxGrade.normalizeScore < score) {
          maxGrade = {uid: user.uid, songId: song.id, normalizeScore: score, grade: result.data.values.get(song.id) ?? -1};
        } else if (minGrade.normalizeScore > score) {
          minGrade = {uid: user.uid, songId: song.id, normalizeScore: score, grade: result.data.values.get(song.id) ?? -1};
        }
      });
    });
    this.minMaxGrades = {
      min: minGrade,
      max: maxGrade
    };
  }

  propertyExists(property: keyof Song): boolean {
    return Array.from(this.songs.values()).findIndex((s) => { return !isNil(s[property]); }) !== -1;
  }
}
