import { Component, Input, SimpleChanges } from '@angular/core';
import { Song, User, UserFavorites } from 'chelys';
import { isNil } from 'lodash';
import { HeatmapData } from 'src/app/types/charts';
import { SongGradeResult, UserGradeResults } from 'src/app/types/results';

@Component({
  selector: 'app-grade-relationship',
  templateUrl: './grade-relationship.component.html',
  styleUrls: ['./grade-relationship.component.scss']
})
export class GradeRelationshipComponent {

  @Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
  @Input() favorites: Map<string, UserFavorites> = new Map();
  @Input() userResults: Map<string, UserGradeResults> = new Map();
  @Input() songResults: SongGradeResult[] = [];

  heatmapData: HeatmapData[] = [];
  xAxisNames: string[] = [];
  yAxisNames: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.songResults = changes['songResults'].currentValue;
    this.generateData();
  }

  constructor() { }

  // Count relation points from uid1 to uid2
  countRelations(uid1: string, uid2: string): number {
    const results1 = this.userResults.get(uid1);
    const favorites1 = this.favorites.get(uid1)?.favs;
    if (isNil(results1) || isNil(favorites1)) return -1;

    const songs2 = Array.from(this.songs.values())
      .filter((song) => song.user === uid2).map((song) => song.id);

    return songs2.filter((song) => favorites1.includes(song)).length + songs2.filter((song) => results1.mean < (results1.data.values.get(song) || -1)).length;
  }

  generateData() {
    this.heatmapData = [];
    this.xAxisNames = [];
    this.yAxisNames = [];

    this.users.forEach((value) => {
      this.xAxisNames.push(value.displayName);
      this.yAxisNames.push(value.displayName);
    })

    const users = Array.from(this.users.values());

    for (let i = 0; i < users.length; i++) {
      const user1 = users[i];
      for (let j = 0; j < users.length; j++) {
        const user2 = users[j];
        this.heatmapData.push([i, j, user1.uid === user2.uid ? 0 : this.countRelations(user1.uid, user2.uid)])
      }
    }
  }

}
