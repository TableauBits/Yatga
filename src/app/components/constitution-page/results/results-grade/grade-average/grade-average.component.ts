import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EMPTY_USER, Song, User } from 'chelys';
import { UserGradeResults } from 'src/app/types/results';
import { RadarData, RadarIndicator } from 'src/app/types/charts';
import { AuthService } from 'src/app/services/auth.service';
import { isNil } from 'lodash';

const RADAR_INDICATOR_MAX = 10;

@Component({
  selector: 'app-grade-average',
  templateUrl: './grade-average.component.html',
  styleUrls: ['./grade-average.component.scss']
})
export class GradeAverageComponent implements OnChanges {

  @Input() numberOfSongsByUser: number = -1;
  @Input() users: Map<string, User> = new Map();
  @Input() songs: Map<number, Song> = new Map();
  @Input() userResults: Map<string, UserGradeResults> = new Map();

  radarIndicators: RadarIndicator[] = [];
  radarDatas: RadarData[] = [];
  selectedUser: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.userResults = changes['userResults'].currentValue;
    this.generateRadarInfos();   // Init values
  }

  constructor(private auth: AuthService) {
    this.selectedUser = auth.uid;
  }

  generateRadarInfos(): void {
    this.radarIndicators = [];
    this.radarDatas = [];
    const values: number[] = [];

    for (const user of this.users.values()) {
      if (user.uid === this.selectedUser) continue;
      this.radarIndicators.push({name: user.displayName, max: RADAR_INDICATOR_MAX});
      values.push(this.meanBetweenUsers(this.selectedUser, user.uid));
    }

    this.radarDatas.push({value: values, name: 'Moyenne (1-10)'});
  }

  getMean(giver: string, receiver: string): number | string {
    if (giver === receiver) return '/';
    return this.meanBetweenUsers(giver, receiver).toFixed(2);
  }

  meanBetweenUsers(giver: string, receiver: string): number {
    let mean = 0;
    const values = this.userResults.get(giver)?.data;
    if (isNil(values)) return 0;

    values.values.forEach((value, key) => {
      const song = this.songs.get(key);
      if (song?.user === receiver) {
        mean += value;
      }
    });

    return Number((mean / this.numberOfSongsByUser).toPrecision(3));
  }

  getSelectedUser(): User {
    return this.users.get(this.selectedUser) || EMPTY_USER;
  }

  getUserList(): User[] {
    return Array.from(this.users.values());
  }

  newSelection(): void  {
    this.generateRadarInfos();
  }

}
