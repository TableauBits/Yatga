import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNil } from 'lodash';
import { environment } from 'src/environments/environment';

import firebase from 'firebase/app';
import { NewAccount } from 'chelys';
import { AngularFireAuth } from '@angular/fire/auth';

const NO_INVITE = "";

@Component({
  selector: 'app-invite-page',
  templateUrl: './invite-page.component.html',
  styleUrls: ['./invite-page.component.scss']
})
export class InvitePageComponent {

  public inviteForm: FormGroup;
  public HTTPconnectionURL: string;

  constructor(
    public fb: FormBuilder, 
    private http: HttpClient,
    private fireAuth: AngularFireAuth
  ) {
    this.inviteForm = this.fb.group({
      inviteID: [, Validators.required]
    });

    this.HTTPconnectionURL = `${environment.protocolHTTP}${environment.serverAPI}`;
    if (!environment.production) {
      this.HTTPconnectionURL += `:${environment.portWebSocket}`;
    }
  }

  getInviteID(): string {
    const inviteID = this.inviteForm.get('inviteID')?.value as string;
    if (isNil(inviteID)) return NO_INVITE;
    return inviteID;
  }

  findInvite(): void {
    const inviteID = this.getInviteID();

    this.http.get(`${this.HTTPconnectionURL}/invite/${inviteID}`).subscribe((response) => {
      console.log(response);
    });
  }

  async getGoogleCredentials(): Promise<NewAccount> {
    const provider = new firebase.auth.GoogleAuthProvider();
		const user = (await this.fireAuth.signInWithPopup(provider)).user;

    if (isNil(user)) {
      throw new Error("sucks 2 b u");
    }

    return {
      uid: user.uid,
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
    }
  }

  async createAccount(): Promise<void> {
    try {
      const accountInfo = await this.getGoogleCredentials();
      const inviteID = this.getInviteID();
      this.http.post(`${this.HTTPconnectionURL}/invite/${inviteID}`, {newAccount: accountInfo}).subscribe((response) => console.log(response));
    } catch (error) {
      //TODO: afficher la fin du monde
      console.log("get REKT");
    }
  }

}
