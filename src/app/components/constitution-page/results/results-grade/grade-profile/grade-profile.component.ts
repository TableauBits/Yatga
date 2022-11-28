import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Constitution, EMPTY_CONSTITUTION, EMPTY_SONG, EMPTY_USER, Role, Song, User, UserFavorites } from 'chelys';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { DownloadService } from 'src/app/services/download.service';
import { EMPTY_USER_GRADE_RESULTS, SongGrade, SongGradeResult, UserGradeResults } from 'src/app/types/results';

@Component({
  selector: 'app-grade-profile',
  templateUrl: './grade-profile.component.html',
  styleUrls: ['./grade-profile.component.scss']
})
export class GradeProfileComponent implements OnChanges {

  @Input() result: UserGradeResults = EMPTY_USER_GRADE_RESULTS;
  @Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
  @Input() favorites: Map<string, UserFavorites> = new Map();
  @Input() constitution: Constitution = EMPTY_CONSTITUTION;
  @Input() userResults: Map<string, UserGradeResults> = new Map();
  @Input() songResults: SongGradeResult[] = [];

  histogramValues: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.histogramValues = Array.from(changes['result'].currentValue.data.values.values());
  }

  constructor(private auth: AuthService, private dwl: DownloadService) { }

  getUser(uid: string): User {
    return this.users.get(uid) || EMPTY_USER;
  }

  getSelectedUserFavorites(): Song[] {
    const favIds = this.favorites.get(this.auth.uid);
    if (isNil(favIds)) return [];

    return favIds.favs.map((id) => this.songs.get(id) || EMPTY_SONG);
  }

  getSelectedUserSong(): SongGrade[] {
    const userResult = this.result;
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

  downloadResults(): void {
    const data = JSON.stringify({
      name: this.constitution.name,
      favorites: Array.from(this.favorites.values()),
      songs: Array.from(this.songs.values()),
      songResults: this.songResults,
      users: Array.from(this.users.values()).map((user) => {
        return {
          description: user.description,
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL
        };
      }),
      userResults: Array.from(this.userResults.values()).map((result) => {
        return {
          ...result,
          data: {
            ...result.data,
            values: Array.from(result.data.values.entries()),
          },
          normalizeScores: Array.from(result.normalizeScores.entries()),
        };
      }),
    });

    this.dwl.dyanmicDownloadByHtmlTag({
      fileName: this.constitution.name + ".json",
      text: data,
    });
  }

  isAdmin(): boolean {
    return this.auth.user.roles.includes(Role.ADMIN);
  }
}
