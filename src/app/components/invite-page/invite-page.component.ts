import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNil } from 'lodash';
import { environment } from 'src/environments/environment';

import firebase from 'firebase/compat/app';
import { EMPTY_USER, InvResGET, InvResPOST, NewAccount } from 'chelys';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';

const NO_INVITE = "";

@Component({
  selector: 'app-invite-page',
  templateUrl: './invite-page.component.html',
  styleUrls: ['./invite-page.component.scss']
})
export class InvitePageComponent {

  public inviteForm: FormGroup;
  public hasReceivedGETResponse: boolean;
  public inviteGETResponse: InvResGET;
  public hasReceivedPOSTResponse: boolean;
  public invitePOSTResponse: InvResPOST;
  public HTTPconnectionURL: string;

  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    private fireAuth: AngularFireAuth,
    public auth: AuthService
  ) {
    this.inviteForm = this.fb.group({
      inviteID: [, Validators.required]
    });
    this.hasReceivedGETResponse = false;
    this.inviteGETResponse = { isValid: false, inviter: EMPTY_USER };
    this.hasReceivedPOSTResponse = false;
    this.invitePOSTResponse = { response: { success: false, status: "" } };

    this.HTTPconnectionURL = `${environment.protocolHTTP}${environment.serverAPI}:${environment.portWebSocket}`;
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
      this.hasReceivedGETResponse = true;
      this.inviteGETResponse = response as InvResGET;
    });
  }

  async getGoogleCredentials(): Promise<NewAccount> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const user = (await this.fireAuth.signInWithPopup(provider)).user;

    if (isNil(user)) {
      throw new Error("User Google Credentials are nil");
    }

    return {
      uid: user.uid,
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
    };
  }

  async createAccount(): Promise<void> {
    try {
      const accountInfo = await this.getGoogleCredentials();
      const inviteID = this.getInviteID();
      this.http.post(`${this.HTTPconnectionURL}/invite/${inviteID}`, { newAccount: accountInfo }).subscribe((response) => {
        console.log(response);
        this.hasReceivedPOSTResponse = true;
        this.invitePOSTResponse = response as InvResPOST;
      });
    } catch (error) {
      console.error("createAccount: ", error);
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  getPOSTStatus(): string {
    if (this.hasReceivedPOSTResponse) {
      const success = "Votre compte Matbay a été créé";
      const error = `Une erreur est survenue: ${this.invitePOSTResponse.response.status}`;

      return this.invitePOSTResponse.response.success ? success : error;
    }

    return "Votre compte n'a pas encore été créé.";
  }

}
