import { Component, Input } from '@angular/core';
import { Song, User, UserFavorites } from 'chelys';
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

  constructor() { }

}
