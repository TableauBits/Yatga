import { Component, Input } from '@angular/core';
import { Constitution, ConstitutionType, EMPTY_CONSTITUTION, Song, User, UserFavorites } from 'chelys';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {

  @Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
  @Input() favorites: Map<string, UserFavorites> = new Map();

  // HTML can't access the ConstiutionType enum directly
	public get constitutionType(): typeof ConstitutionType {
		return ConstitutionType;
	}

  constructor() { }

}
