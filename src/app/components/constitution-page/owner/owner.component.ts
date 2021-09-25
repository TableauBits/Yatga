import { Component, Input } from '@angular/core';
import { Constitution, ConstitutionType, EMPTY_CONSTITUTION, Song, User } from 'chelys';

@Component({
	selector: 'app-owner',
	templateUrl: './owner.component.html',
	styleUrls: ['./owner.component.scss']
})
export class OwnerComponent {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map(); // TODO utile la map ?
	@Input() songs: Map<number, Song> = new Map();

	// HTML can't access the ConstiutionType enum directly
	public get constitutionType(): typeof ConstitutionType {
		return ConstitutionType;
	}

	constructor() { }

	numberOfSongs(): number {
		return this.constitution.maxUserCount * this.constitution.numberOfSongsPerUser;
	}

	usersProgressBarValue(): number {
		return this.users.size / this.constitution.maxUserCount * 100;
	}

	songsProgressBarValue(): number {
		return this.songs.size / this.numberOfSongs() * 100;
	}

}
