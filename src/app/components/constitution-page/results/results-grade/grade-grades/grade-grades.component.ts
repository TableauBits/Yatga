import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { EMPTY_SONG, EMPTY_USER, Song, User } from 'chelys';
import { isNil, toNumber } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { GetUrlService } from 'src/app/services/get-url.service';
import { mean, variance } from 'src/app/types/math';
import { SongGrade, UserGradeResults } from 'src/app/types/results';
import { compareObjectsFactory } from 'src/app/types/utils';

@Component({
  selector: 'app-grade-grades',
  templateUrl: './grade-grades.component.html',
  styleUrls: ['./grade-grades.component.scss']
})
export class GradeGradesComponent implements OnChanges {

  @Input() songs: Map<number, Song> = new Map();
  @Input() users: Map<string, User> = new Map();
  @Input() userResults: Map<string, UserGradeResults> = new Map();

  selectedSong: string;

  histogramValues: number[] = [];
  selectedUser: string;
  selecedUserMean: number = 0;
  selectedUserVar: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.userResults = changes['userResults'].currentValue;
    this.histogramValues = this.getUserHistogramValues();   // Init values
  }

  constructor(private auth: AuthService, public urlGetter: GetUrlService) {
    this.selectedUser = auth.uid;
    this.selectedSong = '-1';
  }

  getSongList(): Song[] {
    return Array.from(this.songs.values()).sort(compareObjectsFactory("id", false));
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
  }
}
