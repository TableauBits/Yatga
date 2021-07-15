import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { createMessage, EventTypes, Message } from 'src/app/types/message';
import { returnUserRoles, Role, User } from 'src/app/types/user';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {

  public profileForm: FormGroup;

  constructor(public auth: AuthService, public fb: FormBuilder) {
    this.profileForm = this.fb.group({
      displayName: ["", Validators.required],
      photoURL: ["", Validators.required]
    })
    this.auth.waitForAuth(this.handleEvents, this.onConnect, this);
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message: Message<unknown>;
  }

  private onConnect(): void {
    this.profileForm.get("displayName")?.setValue(this.auth.user.displayName);
    this.profileForm.get("photoURL")?.setValue(this.auth.user.photoURL);
  }

  updateProfile(): void {
    const displayName = this.profileForm.get('displayName');
    const photoURL = this.profileForm.get('photoURL');

    const newUser: User = {...this.auth.user};

    if (displayName) newUser.displayName =  displayName.value;
    if (photoURL) newUser.photoURL = photoURL.value;

    const editProfileMessage = createMessage(EventTypes.USER_edit, {userData: newUser});
    this.auth.ws.send(editProfileMessage);
  }

  getRoles(): Role[] {
    const roles = returnUserRoles(this.auth.user.roles)
    return roles ? roles : [];
  }

}
