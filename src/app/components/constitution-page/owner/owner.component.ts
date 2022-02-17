import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constitution, ConstitutionType, EMPTY_CONSTITUTION, Song, User } from 'chelys';

@Component({
	selector: 'app-owner',
	templateUrl: './owner.component.html',
	styleUrls: ['./owner.component.scss']
})
export class OwnerComponent {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();

	public constitutionParameterForm: FormGroup;

	// HTML can't access the ConstiutionType enum directly
	public get constitutionType(): typeof ConstitutionType {
		return ConstitutionType;
	}

	constructor(public fb: FormBuilder) {
		this.constitutionParameterForm = this.fb.group({
			name: [this.constitution.name, Validators.required], 
			playlistLink: [this.constitution.playlistLink],

			// required ?
			isPublic: [this.constitution.isPublic, Validators.required],
			anonymousLevel: [this.constitution.anonymousLevel, Validators.required],
		})
	}

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
