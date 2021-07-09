import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { createMessage, EventTypes, Message } from 'src/app/types/message';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {

  public profileForm: FormGroup;

  constructor(public auth: AuthService, public fb: FormBuilder) {
    this.auth.waitForAuth(this.handleEvents);
    this.profileForm = fb.group({
      displayName: [this.auth.user.displayName, Validators.required],
      photoURL: [this.auth.user.photoURL, Validators.required]
    })
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message: Message<unknown>;
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

}
