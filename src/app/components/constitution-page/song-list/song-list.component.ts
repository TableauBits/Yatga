import { Component, Input } from '@angular/core';
import { EMPTY_USER, Song, User } from '@tableaubits/hang';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent {

  @Input() songs: Map<number, Song>;
  @Input() users: Map<string, User>;

  constructor() {
    this.songs = new Map();
    this.users = new Map();
  }

  getSongs(): Song[] {
    return Array.from(this.songs.values());
  }

  getUser(uid: string): User {
    return this.users.get(uid) || EMPTY_USER;
  }

}
