import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EMPTY_SONG, EMPTY_USER, Song, User, UserFavorites } from 'chelys';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { EMPTY_USER_GRADE_RESULTS, SongGrade, UserGradeResults } from 'src/app/types/results';

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

  histogramValues: number[] = []

  ngOnChanges(changes: SimpleChanges): void {
    this.histogramValues = Array.from(changes['result'].currentValue.data.values.values());
  }

  constructor(private auth: AuthService) { }

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
      })
    });
   
    return songs.sort((a, b) => b.grade - a.grade);
  }
}
