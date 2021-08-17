import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createMessage, EMPTY_USER, EventType, User } from '@tableaubits/hang';
import { isEqual } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { returnUserRoles, RoleData } from 'src/app/types/role';

const DISPLAY_NAME_MIN_LENGTH = 1;
const DISPLAY_NAME_MAX_LENGTH = 25;

const DESCRIPTION_MAX_LENGTH = 140;

interface Status {
	error: boolean;
	hidden: boolean;
	message: string;
}

@Component({
	selector: 'app-profile-page',
	templateUrl: './profile-page.component.html',
	styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {

	public errorStatus: Status;
	public profileForm: FormGroup;

	constructor(public auth: AuthService, public fb: FormBuilder) {
		this.profileForm = this.fb.group({
			displayName: [this.isAlreadyAuth() ? this.auth.user.displayName : "", Validators.required],
			photoURL: [this.isAlreadyAuth() ? this.auth.user.photoURL : "", Validators.required],
			description: [this.isAlreadyAuth() ? this.auth.user.description : ""],
		})
		this.errorStatus = {
			error: false,
			hidden: true,
			message: "",
		}
		this.auth.waitForAuth(() => { }, this.onConnect, this);
	}

	private isAlreadyAuth(): boolean {
		return this.auth.user !== EMPTY_USER;
	}

	private onConnect(): void {
		this.profileForm.get("displayName")?.setValue(this.auth.user.displayName);
		this.profileForm.get("photoURL")?.setValue(this.auth.user.photoURL);
		this.profileForm.get("description")?.setValue(this.auth.user.description);
	}

	notifyFailure(message: string): void {
		this.errorStatus.hidden = false;
		this.errorStatus.error = true;
		this.errorStatus.message = message;
	}

	clearStatus(): void {
		this.errorStatus.hidden = true;
		this.errorStatus.error = false;
		this.errorStatus.message = '';
	}

	updateProfile(): void {
		const displayName = this.profileForm.get('displayName');
		const photoURL = this.profileForm.get('photoURL');
		const description = this.profileForm.get('description');

		const newUser: User = { ...this.auth.user };

		if (displayName) {
			const value = displayName.value as string;
			// TODO : server failure ?
			if (value.length < DISPLAY_NAME_MIN_LENGTH || value.length > DISPLAY_NAME_MAX_LENGTH) {
				this.notifyFailure(`Le nouveau nom d'utilisateur est invalide (Doit être entre ${DISPLAY_NAME_MIN_LENGTH} et ${DISPLAY_NAME_MAX_LENGTH} caractères)`);
			} else {
				newUser.displayName = value;
				this.clearStatus();
			}
		}
		if (photoURL) newUser.photoURL = photoURL.value;
		if (description) {
			const value = description.value as string;
			// TODO : server failure ?
			if (value.length > DESCRIPTION_MAX_LENGTH) {
				this.notifyFailure(`La description de votre profil est trop longue (${value.length}/${DESCRIPTION_MAX_LENGTH} caractères authorisés)`);
			} else {
				newUser.description = value;
				this.clearStatus();
			}
		}

		if (isEqual(this.auth.user, newUser)) { return; }

		if (this.errorStatus.hidden) {
			const editProfileMessage = createMessage(EventType.USER_edit, { userData: newUser });
			this.auth.ws.send(editProfileMessage);
		}
	}

	getRoles(): RoleData[] {
		const roles = returnUserRoles(this.auth.user.roles)
		return roles ? roles : [];
	}

}
