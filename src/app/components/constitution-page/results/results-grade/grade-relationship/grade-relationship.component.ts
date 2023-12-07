import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Song, User, UserFavorites } from 'chelys';
import { isNil } from 'lodash';
import { ChordCategory, ChordLink, ChordNode, EMPTY_SIMPLE_SCATTER_CONFIG, HeatmapData, SimpleScatterConfig } from 'src/app/types/charts';
import { SongGradeResult, UserGradeResults } from 'src/app/types/results';
import { keepUniqueValues } from 'src/app/types/utils';

@Component({
  selector: 'app-grade-relationship',
  templateUrl: './grade-relationship.component.html',
  styleUrls: ['./grade-relationship.component.scss']
})
export class GradeRelationshipComponent implements OnChanges {

  // Input
  @Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
  @Input() favorites: Map<string, UserFavorites> = new Map();
  @Input() userResults: Map<string, UserGradeResults> = new Map();
  @Input() songResults: SongGradeResult[] = [];

  // Heatmap
  heatmapData: HeatmapData[] = [];
  xAxisNames: string[] = [];
  yAxisNames: string[] = [];

  // Graph
  categories: ChordCategory[] = [];
  links: ChordLink[] = [];
  nodes: ChordNode[] = [];
  useForce: boolean = false;
  sliderValue: number = 0;
  maxSliderValue: number = 0;
  coordinates: Map<string, {x: number, y: number}> = new Map();

  // Scatter
  xUser: string = "";
  yUser: string = "";
  scatterConfig: SimpleScatterConfig = EMPTY_SIMPLE_SCATTER_CONFIG;

  ngOnChanges(changes: SimpleChanges): void {
    this.songResults = changes['songResults'].currentValue;
    this.generateHeatmap();
    this.generateChord();
  }

  getUserList(): User[] {
    return Array.from(this.users.values());
  }

  // Count relation points from uid1 to uid2
  countRelations(uid1: string, uid2: string): number {
    const results1 = this.userResults.get(uid1);
    const favorites1 = this.favorites.get(uid1)?.favs;
    if (isNil(results1) || isNil(favorites1)) return -1;

    const songs2 = Array.from(this.songs.values())
      .filter((song) => song.user === uid2).map((song) => song.id);

    return songs2.filter((song) => favorites1.includes(song)).length + songs2.filter((song) => results1.mean < (results1.data.values.get(song) || -1)).length;
  }

  generateChord(keepCoordinates?: boolean): void {
    this.categories = Array.from(this.users.values()).map((value) => {
      return { name: value.displayName };
    });

    this.nodes = [];
    this.links = [];
    for (const user1 of this.users.values()) {
      let totalCount = 0;
      for (const user2 of this.users.values()) {
        if (user1.uid === user2.uid) continue;
        const count = this.countRelations(user1.uid, user2.uid);
        if (count === 0) continue;
        if (this.maxSliderValue < count) this.maxSliderValue = count;
        totalCount += count;
        if (count > this.sliderValue) {
          this.links.push({
            source: user1.uid, 
            target: user2.uid,
            value: count,
            lineStyle: {
              width: count,
              curveness: 0.5,
              opacity: 0.7
            }
          });
        }
      }
      let x, y;
      if (keepCoordinates) {
        const coordinates = this.coordinates.get(user1.uid);
        x = coordinates?.x;
        y = coordinates?.y;
      } else {
        x = Math.random() * 80;
        y = Math.random() * 80;
        this.coordinates.set(user1.uid, {x, y});
      }

      this.nodes.push({
        id: user1.uid,
        name: user1.displayName,
        symbolSize: 5 + totalCount,
        value: totalCount,
        x: x,
        y: y,
        category: this.nodes.length, // Math.round(Math.random() * this.categories.length), // this.nodes.length,
        label: {
          show: true
        }
      });
    }
  }

  generateHeatmap(): void {
    this.heatmapData = [];
    this.xAxisNames = [];
    this.yAxisNames = [];

    this.users.forEach((value) => {
      this.xAxisNames.push(value.displayName);
      this.yAxisNames.push(value.displayName);
    });

    const users = Array.from(this.users.values());

    for (let i = 0; i < users.length; i++) {
      const user1 = users[i].uid;
      for (let j = 0; j < users.length; j++) {
        const user2 = users[j].uid;
        this.heatmapData.push([i, j, user1 === user2 ? 0 : this.countRelations(user1, user2)]);
      }
    }
  }

  updateForce(): void {
    this.useForce = !this.useForce;
  }

  generateSimpleScatterConfig(): void {
    const data: Array<[number, number]> = [];
    const counts = new Map<string, number>();

    if (![this.xUser, this.yUser].includes("")) {
      this.songs.forEach(song => {
        // Les utilisateurs n'ont pas de votes communs
        if ([this.xUser, this.yUser].includes(song.user)) return;

        const x = Number(this.userResults.get(this.xUser)?.normalizeScores.get(song.id)?.toPrecision(3));
        const y = Number(this.userResults.get(this.yUser)?.normalizeScores.get(song.id)?.toPrecision(3));
        data.push([x, y]);

        // count the number of occurences of each pair
        const key = [x, y].join(",");
        counts.set(key, (counts.get(key) ?? 0) + 1);
      });
    }

    const max = Math.max(...counts.values());
    const min = Math.min(...counts.values());

    const xUserDisplayName = this.users.get(this.xUser)?.displayName;
    const yUserDisplayName = this.users.get(this.yUser)?.displayName;

    this.scatterConfig = {
      data: keepUniqueValues(data).map(value => [value[0], value[1], counts.get(value.join(",")) ?? 0]),
      color: "#693BB8",
      formatter: (value) => {
        return `${xUserDisplayName}: ${value.data[0]} <br> ${yUserDisplayName}: ${value.data[1]} <br> Nombre: ${value.data[2]}`;
      },
      symbolSize: (value) => {
        const minMaxNormalized = (value[2] - min) / (max - min);
        return minMaxNormalized*50;
      },
      xAxisName: `Score de ${xUserDisplayName}`,
      yAxisName: `Score de ${yUserDisplayName}`
    };
  }

  newSelection(): void {
    this.generateSimpleScatterConfig();
  }

}
