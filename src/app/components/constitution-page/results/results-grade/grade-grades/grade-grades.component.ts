import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { EMPTY_SONG, EMPTY_USER, Song, User, UserFavorites } from 'chelys';
import { flatten, isNil, range, toNumber } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { GetUrlService } from 'src/app/services/get-url.service';
import { EMPTY_SCATTER_CONFIG, ScatterConfig, ScatterData } from 'src/app/types/charts';
import { mean, variance } from 'src/app/types/math';
import { SongGrade, UserGradeResults } from 'src/app/types/results';
import { GRADE_VALUES, LANGUAGES_CODE_TO_FR } from 'src/app/types/song-utils';
import { keepUniqueValues, toDecade } from 'src/app/types/utils';

enum OptionnalParametersSelection {
  LANGUAGES = "languages",
  GENRES = "genres",
  RELEASE_YEAR = "releaseYear",
  FAVORITES = "favorites"
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
  @Input() favorites: Map<string, UserFavorites> = new Map();

  selectedSong: string;

  histogramValues: number[] = [];
  selectedUser: string;
  selecedUserMean: number = 0;
  selectedUserVar: number = 0;

  selection: OptionnalParametersSelection = OptionnalParametersSelection.LANGUAGES;
  languagesScatterConfig: ScatterConfig = EMPTY_SCATTER_CONFIG;
  favoritesScatterConfig: ScatterConfig = EMPTY_SCATTER_CONFIG;
  decadesScatterConfig: ScatterConfig = EMPTY_SCATTER_CONFIG;
  genresScatterConfig: ScatterConfig = EMPTY_SCATTER_CONFIG;

  ngOnChanges(changes: SimpleChanges): void {
    this.userResults = changes['userResults'].currentValue;
    this.histogramValues = this.getUserHistogramValues();
    this.generateScatterInfos();
  }

  constructor(private auth: AuthService, public urlGetter: GetUrlService) {
    this.selectedUser = auth.uid;
    this.selectedSong = '-1';
  }

  	// HTML can't access the AdminSection enum directly
	public get optionnalParametersSelection(): typeof OptionnalParametersSelection {
		return OptionnalParametersSelection;
	}

  getSongList(): Song[] {
    return Array.from(this.songs.values());
  }

  getSelectedSong(): Song {
    const id = toNumber(this.selectedSong);
    return this.songs.get(id) || EMPTY_SONG;
  }

  getImageURL(): string {
    const song = this.getSelectedSong();
    return this.urlGetter.getImageURL(song);
	}

  returnVote(uid: string): number | string {
    return this.userResults.get(uid)?.data.values.get(toNumber(this.selectedSong)) || '/';
  }

  returnScore(uid: string): number | string {
    return this.userResults.get(uid)?.normalizeScores.get(toNumber(this.selectedSong))?.toFixed(4) || '/';
  }

  getUser(uid: string): User {
    return this.users.get(uid) || EMPTY_USER;
  }

  getSelectedUser(): User {
    return this.users.get(this.selectedUser) || EMPTY_USER;
  }

  getSelectedUserSong(): SongGrade[] {
    const userResult = this.userResults.get(this.selectedUser);
    if (isNil(userResult)) return [];
    let songs: SongGrade[] = [];
    userResult.data.values.forEach((value, key) => {
      songs.push({
        song: this.songs.get(key) || EMPTY_SONG,
        grade: value
      });
    });
   
    return songs.sort((a, b) => b.grade - a.grade);
  }

  getUserList(): User[] {
    return Array.from(this.users.values());
  }

  getUserHistogramValues(): number[] {
    const userResult = this.userResults.get(this.selectedUser);
    if (isNil(userResult)) return [];
    const values = Array.from(userResult.data.values.values());
    this.selecedUserMean = mean(values);
    this.selectedUserVar = variance(this.selecedUserMean, values);
    return values;
  }

  newSelection(): void  {
    this.histogramValues = this.getUserHistogramValues();
    this.generateScatterInfos();
  }

  generateScatterInfos(): void {
    const songs = this.getSongList().filter(s => s.user !== this.selectedUser); // Only keep song that the selected user have a vote for
    const votes = this.userResults.get(this.selectedUser)?.data.values;

    this.generateLanguagesScatterConfig(songs, votes);
    this.generateFavoritesScatterConfig(votes);
    this.generateDecadeScatterConfig(songs, votes);
    this.generateGenresScatterConfig(songs, votes);
  }

  generateLanguagesScatterConfig(songs: Song[], votes: Map<number, number> | undefined): void {
    // Init
    const languages = keepUniqueValues(flatten(this.getSongList()
      .filter(s => !isNil(s.languages))
      .map(s => s.languages)
    )).sort();

    const data = flatten(languages.map((language, index) => {
      let scatterPoints: ScatterData[] = [];
      range(1, 11).forEach(grade => {
        const count = songs.filter(s => s.languages?.includes(language ?? "") && votes?.get(s.id) === grade).length;
        if (count === 0) return;
        scatterPoints.push([index, grade-1, count]);  // grade-1 because index should start at 0
      });
      return scatterPoints;
    }));

    const max = Math.max(...data.map(d => d[2]));
    const min = Math.min(...data.map(d => d[2]));

    // Config
    this.languagesScatterConfig = {
      axisMax: 10,
      symbolSize: (param) => {
        const minMaxNormalized = (param[1] - min) / (max - min);
        return minMaxNormalized * 50;
      },
      data: data,
      names: languages.map(language => LANGUAGES_CODE_TO_FR.get(language ?? "") ?? "")
    };
  }

  generateGenresScatterConfig(songs: Song[], votes: Map<number, number> | undefined): void {
    const genres = keepUniqueValues(flatten(this.getSongList().filter(s => !isNil(s.genres)).map(s => s.genres))).sort() as string[];

    const data = flatten(genres.map((genre, index) => {
      let scatterPoints: ScatterData[] = [];
      range(1, 11).forEach(grade => {
        const count = songs.filter(s => s.genres?.includes(genre ?? "") && votes?.get(s.id) === grade).length;
        if (count === 0) return;
        scatterPoints.push([index, grade-1, count]);  // grade-1 because index should start at 0
      });
      return scatterPoints;
    }));

    const max = Math.max(...data.map(d => d[2]));
    const min = Math.min(...data.map(d => d[2]));

    this.genresScatterConfig = {
      axisMax: 10,
      symbolSize: (param) => {
        const minMaxNormalized = (param[1] - min) / (max - min);
        return minMaxNormalized * 50;
      },
      data: data,
      names: genres
    };
  }

  generateDecadeScatterConfig(songs: Song[], votes: Map<number, number> | undefined): void {
     // Init
    const decades = keepUniqueValues(this.getSongList()
      .filter(s => !isNil(s.releaseYear))
      .map(s => toDecade(s.releaseYear))).sort();

    const data = flatten(decades.map((decade, index) => {
      let scatterPoints: ScatterData[] = [];
      range(1, 11).forEach(grade => {
        const count = songs.filter(s => toDecade(s.releaseYear) === decade && votes?.get(s.id) === grade).length;
        if (count === 0) return;
        scatterPoints.push([index, grade-1, count]);
      });
      return scatterPoints;
    }));

    const max = Math.max(...data.map(d => d[2]));
    const min = Math.min(...data.map(d => d[2]));

    // Config
    this.decadesScatterConfig = {
      axisMax: 10,
      symbolSize: (param) => {
        const minMaxNormalized = (param[1] - min) / (max - min);
        return minMaxNormalized * 50;
      },
      data: data,
      names: decades.map(d => d.toString())
    };
  }

  generateFavoritesScatterConfig(votes: Map<number, number> | undefined): void {
    // Init
    const favorites = this.favorites.get(this.selectedUser)?.favs;
    if (isNil(favorites) || isNil(votes)) return;

    const data: ScatterData[] = [];
    range(1, 11).forEach(grade => {
      const count = this.getSongList().filter(s => favorites.includes(s.id) && votes.get(s.id) === grade).length;
      if (count === 0) return;
      data.push([0, grade-1, count]);
    });

    const max = Math.max(...data.map(d => d[2]));
    const min = Math.min(...data.map(d => d[2]));

    // Config
    this.favoritesScatterConfig = {
      axisMax: 10,
      symbolSize: (param) => {
        // const minMaxNormalized = (param[1] - min) / (max - min);
        // return minMaxNormalized * 50;
        return param[1] * 15
      },
      color: "#CF387C",
      data: data,
      names: ["Favoris"]
    };
  }

  propertyExists(property: keyof Song): boolean {
    return Array.from(this.songs.values()).findIndex((s) => { return !isNil(s[property]); }) !== -1;
  }
}
