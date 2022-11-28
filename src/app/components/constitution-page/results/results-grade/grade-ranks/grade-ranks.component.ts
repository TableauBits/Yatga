import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EMPTY_SONG, EMPTY_USER, Song, User } from 'chelys';
import { ScatterData } from 'src/app/types/charts';
import { mean } from 'src/app/types/math';
import { SongGradeResult } from 'src/app/types/results';

const NO_RESULT = -1;

interface UserRankResult {
  uid: string;
  rank: number;
  max: number;
  min: number;
}

function compareRank(u1: UserRankResult, u2: UserRankResult): number {
	if (u1.rank > u2.rank) return 1;
	if (u1.rank < u2.rank) return -1;
	return 0;
}

@Component({
  selector: 'app-grade-ranks',
  templateUrl: './grade-ranks.component.html',
  styleUrls: ['./grade-ranks.component.scss']
})
export class GradeRanksComponent implements OnChanges {

  @Input() users: Map<string, User> = new Map();
  @Input() songs: Map<number, Song> = new Map();
  @Input() songResults: SongGradeResult[] = [];

  usersRank: UserRankResult[] = [];

  scatterNames: string[] = [];
  scatterData: ScatterData[] = [];
  scatterAxisMax: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.songResults = changes['songResults'].currentValue;
    this.generateScatterInfos();   // Init values
    this.generateRankResults();
  }

  constructor() { }

  getUser(uid: string): User {
		return this.users.get(uid) || EMPTY_USER;
	}

  getSong(id: number): Song {
    return this.songs.get(id) || EMPTY_SONG;
  }

  generateRankResults(): void {
    this.usersRank = [];
    for (const user of this.users.values()) {
      const userSongResults = this.songResults.map((value, index) => {
        if (this.getSong(value.id).user === user.uid) {
          return index + 1;
        }
        return NO_RESULT;
      }).filter((value) => { return value !== NO_RESULT; });

      this.usersRank.push({
        uid: user.uid,
        rank: mean(userSongResults),
        max: Math.max(...userSongResults),
        min: Math.min(...userSongResults)
      });
    }
    this.usersRank.sort(compareRank);
  }

  generateScatterInfos(): void {
    this.scatterNames = [];
    this.scatterData = [];
    this.scatterAxisMax = this.songResults.length;

    for (const user of this.users.values()) {   
      this.scatterNames.push(user.displayName);
    }

    for (let index = 0; index < this.songResults.length; index++) {
      const result = this.songResults[index];
      const song = this.songs.get(result.id);
      const keys = Array.from(this.users.keys());
      const userIndex = keys.findIndex((key) => { return key === song?.user;});
      
      this.scatterData.push([userIndex, index, 1]);
    }
  }

}
