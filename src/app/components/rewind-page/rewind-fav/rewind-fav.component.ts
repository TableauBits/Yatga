import { Component, Input, OnInit } from '@angular/core';
import { EMPTY_USER, User } from 'chelys';

@Component({
  selector: 'rewind-fav',
  templateUrl: './rewind-fav.component.html',
  styleUrls: ['./rewind-fav.component.scss']
})
export class RewindFavComponent implements OnInit {
  @Input() title: string = "";
  @Input() favs: Map<string, number> = new Map();
  @Input() users: Map<string, User> = new Map();

  constructor() { }

  ngOnInit(): void {
  }

  getMaxFavs(): number {
    const values = Array.from(this.favs.values())
    if (values.length === 0) {
      return 0;
    }

    return Math.max(...values);
  }

  getNumberOfFavs(): number {
    return Array.from(this.favs.values()).reduce((a, b) => a + b, 0);
  }

  getFavsSorted(): [string, number][] {
    return Array.from(this.favs.entries()).sort((a, b) => b[1] - a[1]).filter(([_, v]) => v > 0);
  }

  getUser(uid: string): User {
    return this.users.get(uid) ?? EMPTY_USER;
  }

}
