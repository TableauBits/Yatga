import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnonymousLevel, Constitution, ConstitutionType, createMessage, EventType } from 'chelys';
import { isEmpty } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { Status } from 'src/app/types/status';

const ANONIMITY_LEVELS = ["Toutes informations révélées", "Utilisateur caché", "Audio seulement"];

@Component({
	selector: 'app-new-constitution',
	templateUrl: './new-constitution.component.html',
	styleUrls: ['./new-constitution.component.scss']
})
export class NewConstitutionComponent {

	public errorStatus: Status;
	public newConstitutionForm: FormGroup;

	constructor(
		public auth: AuthService,
		public fb: FormBuilder,
		private router: Router) {
		this.newConstitutionForm = this.fb.group({
			season: [, Validators.required],
			part: [, Validators.required],
			name: [, [Validators.required, Validators.maxLength(30)]],
			isPublic: [true, Validators.required],
			anonymousLevel: [, Validators.required],
			type: [, Validators.required],
			playlistLink: [""],
			maxUserCount: [4, Validators.required],
			numberOfSongsPerUser: [1, Validators.required],
		});

		this.errorStatus = new Status();
	}

	public getTypes(): string[] {
		return Object.keys(ConstitutionType).filter((key) => isNaN(key as unknown as number)).splice(0, ConstitutionType.LENGTH);
	}

	public getAnonymityLevels(): string[] {
		return ANONIMITY_LEVELS;
	}

	public checkFormValidity(): string[] {
		const keysForm = Object.keys(this.newConstitutionForm.controls);
		const invalidKeys = [];

		for (const key of keysForm) {
			if (!this.newConstitutionForm.controls[key].valid) {
				invalidKeys.push(key);
			};
		}

		return invalidKeys;
	}

	private toEnumAnonymousLevel(anonymousLevel: string): AnonymousLevel {
		const index = ANONIMITY_LEVELS.findIndex((level) => anonymousLevel === level);
		return index !== -1 ? index : 0;
	}

	private toEnumConstitutionType(type: string): ConstitutionType {
		const index = Object.keys(ConstitutionType).filter((key) => isNaN(key as unknown as number)).findIndex((key) => key === type);
		return index !== -1 ? index : 0;
	}

	public createConstitution(): void {
		const invalidValues = this.checkFormValidity();

		if (!isEmpty(invalidValues)) {
			const text = `Certains champs sont invalides : ${invalidValues.join(', ')}`;
			this.errorStatus.notify(text, true);
		}
		else {
			const constitution: Constitution = {
				id: '',
				name: this.newConstitutionForm.value['name'],
				season: this.newConstitutionForm.value['season'],
				part: this.newConstitutionForm.value['part'],
				type: this.toEnumConstitutionType(this.newConstitutionForm.value['type']),
				playlistLink: this.newConstitutionForm.value['playslistLink'] || "",
				anonymousLevel: this.toEnumAnonymousLevel(this.newConstitutionForm.value['anonymousLevel']),
				isPublic: this.newConstitutionForm.value['isPublic'],
				users: [],
				maxUserCount: this.newConstitutionForm.value['maxUserCount'],
				numberOfSongsPerUser: this.newConstitutionForm.value['numberOfSongsPerUser'],
				state: 0
			};

			const newConstitutionMessage = createMessage(EventType.CST_create, { cstData: constitution });
			this.auth.ws.send(newConstitutionMessage);

			this.router.navigate(['current-constitutions']);
		}

	}
}
