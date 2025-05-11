import { Component, Input } from '@angular/core';
import { EMPTY_USER, User } from 'chelys';

@Component({
  selector: 'rewind-user-score',
  templateUrl: './rewind-user-score.component.html',
  styleUrls: ['./rewind-user-score.component.scss']
})
export class RewindUserScoreComponent {

  @Input() title: string = '';
  @Input() users: Map<string, User> = new Map();

  @Input() userMeanScore: Map<string, number> = new Map();

  constructor() { }

  formatScore(score: number): string {
    return score.toFixed(2);
  }

  getScoresSorted(): [string, number][] {
    return Array.from(this.userMeanScore.entries())
      .sort((a, b) => b[1] - a[1])
      .filter(([_, v]) => v !== 0);
  }

  getUser(uid: string): User {
    return this.users.get(uid) ?? EMPTY_USER;
  }

}
