import { Component, Input } from '@angular/core';
import { EMPTY_REWIND, EMPTY_USER, Team, User } from 'chelys';

@Component({
  selector: 'app-rewind-team',
  templateUrl: './rewind-team.component.html',
  styleUrls: ['./rewind-team.component.scss']
})
export class RewindTeamComponent {

  @Input() type: string = "";
  @Input() description: string = "";
  @Input() teamInfo: Team = { ...EMPTY_REWIND.teamSongs }; // Use spread for a fresh object

  @Input() users: Map<string, User> = new Map();

  constructor() { }

  getUser(uid: string): User {
    return this.users.get(uid) ?? { ...EMPTY_USER, displayName: 'Unknown User', photoURL: '' }; // Ensure displayName and photoURL exist
  }
}