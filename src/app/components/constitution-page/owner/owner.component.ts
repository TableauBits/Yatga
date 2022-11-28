import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constitution, ConstitutionType, createMessage, CstReqDelete, CstReqNameURL, EMPTY_CONSTITUTION, EventType, Song, User } from 'chelys';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-owner',
	templateUrl: './owner.component.html',
	styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnChanges {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();

	public security: boolean;
	public constitutionParameterForm: FormGroup;

	// HTML can't access the ConstiutionType enum directly
	public get constitutionType(): typeof ConstitutionType {
		return ConstitutionType;
	}

	ngOnChanges(): void {
		this.constitutionParameterForm = this.fb.group({
			name: [this.constitution.name, Validators.required], 
			playlistLink: [this.constitution.playlistLink],
		});
	}

	constructor(public fb: FormBuilder, private auth: AuthService) {
		this.constitutionParameterForm = this.fb.group({
			name: [this.constitution.name, Validators.required], 
			playlistLink: [this.constitution.playlistLink],
		});
		this.security = true;
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

	updateNameURL(): void {
		if (isNil(this.constitutionParameterForm.get("name")?.value) || 
			isNil(this.constitutionParameterForm.get("playlistLink")?.value)) return;

		if (this.constitutionParameterForm.get("name")?.value === this.constitution.name &&
		this.constitutionParameterForm.get("playlistLink")?.value === this.constitution.playlistLink) return;


		const message = createMessage<CstReqNameURL>(EventType.CST_name_url, {
			id: this.constitution.id,
			name: this.constitutionParameterForm.get("name")?.value,
			url: this.constitutionParameterForm.get("playlistLink")?.value
		});

		this.auth.ws.send(message);
	}

	updateSecurity(): void {
		this.security = !this.security;
	}

	deleteConstitution(): void {
		this.auth.ws.send(createMessage<CstReqDelete>(EventType.CST_delete, { id: this.constitution.id }));
	}

}
