import { Component, Input } from '@angular/core';
import { Constitution, ConstitutionType, EMPTY_CONSTITUTION, Song, User, UserFavorites } from 'chelys';

@Component({
	selector: 'app-votes',
	templateUrl: './votes.component.html',
	styleUrls: ['./votes.component.scss']
})
export class VotesComponent {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
	@Input() favorites: UserFavorites = { uid: "", favs: []};

	// HTML can't access the ConstiutionType enum directly
	public get constitutionType(): typeof ConstitutionType {
		return ConstitutionType;
	}

	constructor() { }
}
