import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EMPTY_SONG, EMPTY_USER, Song, User } from 'chelys';
import { EMPTY_SCATTER_CONFIG, ScatterConfig } from 'src/app/types/charts';
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

  scatterConfig: ScatterConfig = EMPTY_SCATTER_CONFIG;

  ngOnChanges(changes: SimpleChanges): void {
    this.songResults = changes['songResults'].currentValue;
    this.generateScatterInfos();
    this.generateRankResults();
  }

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
    // Init
    this.scatterConfig = EMPTY_SCATTER_CONFIG;
    const keys = Array.from(this.users.keys());
    
    // New config
    this.scatterConfig = {
      axisMax: this.songResults.length,
      axisLabelInterval: 2,
      symbolSize: () => 30,
      formatter: (p) => {
        const data = p.data as number[];
        const song = this.songs.get(this.songResults[data[0]].id);
        return `${data[0]+1}. ${song?.title} - ${song?.author}`;
      },
      data: this.songResults.map((result, index) => {
        const song = this.songs.get(result.id);
        const userIndex = keys.findIndex((key) => { return key === song?.user;});
        return [userIndex, index, 1];
      }),
      names: Array.from(this.users.values()).map(u => u.displayName)
    };
  }

}
