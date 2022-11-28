import { Component, Input, OnChanges } from '@angular/core';
import { EMPTY_SONG, EMPTY_USER, Song, User, UserFavorites } from 'chelys';
import { isEmpty, isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { PieData } from 'src/app/types/charts';

interface SongFavoriteStat {
  song: number,
  users: string[]
}

function compareSongFavoriteStat(s1: SongFavoriteStat, s2: SongFavoriteStat): number {
	if (s1.users.length > s2.users.length) return -1;
	if (s1.users.length < s2.users.length) return 1;
	return 0;
}

@Component({
  selector: 'app-results-favorites',
  templateUrl: './results-favorites.component.html',
  styleUrls: ['./results-favorites.component.scss']
})
export class ResultsFavoritesComponent implements OnChanges {

  @Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
  @Input() favorites: Map<string, UserFavorites> = new Map();

  selectedUser: string;
  tableInfo: SongFavoriteStat[];
  pieData: PieData[];

  ngOnChanges(): void {
    this.generateTableInfo();
    this.generatePieData();
  }

  constructor(private auth: AuthService) {
    this.selectedUser = auth.uid;
    this.tableInfo = [];
    this.pieData = [];
  }

  generateTableInfo(): void {
    this.tableInfo = [];
    for (const song of this.songs.values()) {
      const users = [];
      for (const favorite of this.favorites.values()) {
        if (!favorite.favs.includes(song.id)) continue;
        users.push(favorite.uid);
      }

      if (isEmpty(users)) continue;
      this.tableInfo.push({
        song: song.id,
        users: users
      });
    }
    this.tableInfo.sort(compareSongFavoriteStat);
  }

  generatePieData(): void {
    this.pieData = [];
    const data = new Map<string, PieData>();
    const selectedFavorites = this.favorites.get(this.selectedUser);

    if (isNil(selectedFavorites)) return;

    for (const fav of selectedFavorites.favs) {
      const user = this.songs.get(fav)?.user;
      if (isNil(user)) continue;

      if (data.has(user)) {
        const count = data.get(user)?.value;
        data.set(user, {name: user, value: count ? count + 1 : 1});
      } else {
        data.set(user, {name: user, value: 1});
      }

      this.pieData = Array.from(data.values()).map((v) => {
        const name = this.getUser(v.name).displayName;
        return {value: v.value, name: name };
      });
    }
  }

  getSong(id: number): Song {
    return this.songs.get(id) || EMPTY_SONG;
  }

  getUser(uid: string): User {
    return this.users.get(uid) || EMPTY_USER;
  }

  getUserList(): User[] {
    return Array.from(this.users.values());
  }

  getSelectedUser(): User {
    return this.users.get(this.selectedUser) || EMPTY_USER;
  }

  getSelectedUserFavorites(): Song[] {
    const favIds = this.favorites.get(this.selectedUser);
    if (isNil(favIds)) return [];

    return favIds.favs.map((id) => this.songs.get(id) || EMPTY_SONG);
  }

  newSelection(): void  {
    this.generatePieData();
  }

}
