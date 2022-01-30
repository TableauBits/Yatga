import { Component, Input, OnChanges } from '@angular/core';
import { EMPTY_SONG, EMPTY_USER, Song, User, UserFavorites } from 'chelys';
import { isEmpty } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';

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

  ngOnChanges(): void {
    this.generateTableInfo();
  }

  constructor(private auth: AuthService) {
    this.selectedUser = auth.uid;
    this.tableInfo = [];
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
      })
    }
    this.tableInfo.sort(compareSongFavoriteStat);
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

  newSelection(): void  {
    // TODO
  }

}
