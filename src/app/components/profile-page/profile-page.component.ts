import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { createMessage, EventTypes, Message } from 'src/app/types/message';
import { returnUserRoles, Role, User } from 'src/app/types/user';

const DISPLAY_NAME_MIN_LENGTH = 1;
const DISPLAY_NAME_MAX_LENGTH = 25;

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
      displayName: ["", Validators.required],
      photoURL: ["", Validators.required]
    })
    this.errorStatus = {
      error: false,
      hidden: true,
      message: "",
    }
    this.auth.waitForAuth(this.handleEvents, this.onConnect, this);
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message: Message<unknown>;
  }

  private onConnect(): void {
    this.profileForm.get("displayName")?.setValue(this.auth.user.displayName);
    this.profileForm.get("photoURL")?.setValue(this.auth.user.photoURL);
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

    const newUser: User = {...this.auth.user};

    if (displayName) {
      const value = displayName.value as string;
      // TODO : server failure ?
      if (value.length < DISPLAY_NAME_MIN_LENGTH || value.length > DISPLAY_NAME_MAX_LENGTH) {
        this.notifyFailure(`Le nouveau nom d'utilisateur est invalide (Doit être entre ${DISPLAY_NAME_MIN_LENGTH} et ${DISPLAY_NAME_MAX_LENGTH} caractères)`)
      } else {
        newUser.displayName =  value;
        this.clearStatus();
      }
    } 
    if (photoURL) newUser.photoURL = photoURL.value;

    if (this.errorStatus.hidden) {
      const editProfileMessage = createMessage(EventTypes.USER_edit, {userData: newUser});
      this.auth.ws.send(editProfileMessage);
    }
  }

  getRoles(): Role[] {
    const roles = returnUserRoles(this.auth.user.roles)
    return roles ? roles : [];
  }

}
