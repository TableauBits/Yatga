import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createMessage, EMPTY_USER, EventType, User } from 'chelys';
import { isEqual } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { returnUserRoles, RoleData } from 'src/app/types/role';
import { Status } from 'src/app/types/status';

const DISPLAY_NAME_MIN_LENGTH = 1;
const DISPLAY_NAME_MAX_LENGTH = 25;

const DESCRIPTION_MAX_LENGTH = 140;

@Component({
	selector: 'app-profile-page',
	templateUrl: './profile-page.component.html',
	styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnDestroy {

	public errorStatus: Status;
	public profileForm: FormGroup;

	constructor(public auth: AuthService, public fb: FormBuilder) {
		this.profileForm = this.fb.group({
			displayName: [this.isAlreadyAuth() ? this.auth.user.displayName : "", Validators.required],
			photoURL: [this.isAlreadyAuth() ? this.auth.user.photoURL : "", Validators.required],
			description: [this.isAlreadyAuth() ? this.auth.user.description : ""],
		});
		this.errorStatus = new Status();
		this.auth.pushAuthFunction(this.onConnect, this);
	}

	ngOnDestroy(): void {
		this.auth.popAuthCallback();
	}

	private isAlreadyAuth(): boolean {
		return this.auth.user !== EMPTY_USER;
	}

	private onConnect(): void {
		this.profileForm.get("displayName")?.setValue(this.auth.user.displayName);
		this.profileForm.get("photoURL")?.setValue(this.auth.user.photoURL);
		this.profileForm.get("description")?.setValue(this.auth.user.description);
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
				this.errorStatus.notify(`Le nouveau nom d'utilisateur est invalide (Doit être entre ${DISPLAY_NAME_MIN_LENGTH} et ${DISPLAY_NAME_MAX_LENGTH} caractères)`, true);
				return;
			} else {
				newUser.displayName = value;
				this.errorStatus.clearStatus();
			}
		}
		if (photoURL) newUser.photoURL = photoURL.value;
		if (description) {
			const value = description.value as string;
			// TODO : server failure ?
			if (value.length > DESCRIPTION_MAX_LENGTH) {
				this.errorStatus.notify(`La description de votre profil est trop longue (${value.length}/${DESCRIPTION_MAX_LENGTH} caractères authorisés)`, true);
				return;
			} else {
				newUser.description = value;
				this.errorStatus.clearStatus();
			}
		}

		if (isEqual(this.auth.user, newUser)) { return; }

		if (this.errorStatus.hidden) {
			const editProfileMessage = createMessage(EventType.USER_edit_profile, { userData: newUser });
			this.auth.ws.send(editProfileMessage);
		}
	}

	getRoles(): RoleData[] {
		const roles = returnUserRoles(this.auth.user.roles);
		return roles ? roles : [];
	}
}
