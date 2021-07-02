import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Yatga';

  ws: WebSocket;

  constructor(private fireAuth: AngularFireAuth) {
    let connectionURL = `${environment.protocolWebSocket}${environment.serverAPI}`;
    if (!environment.production) {
      connectionURL += `:${environment.portWebSocket}`;
      console.warn("Debug mode enabled! Yatga will attempt to connect to: ", connectionURL);
    }
    this.ws = new WebSocket(connectionURL)
    this.ws.onmessage = (event) => {
      console.log(event);
    }
  }

  async signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credentials: firebase.auth.UserCredential = await this.fireAuth.signInWithPopup(provider);
    console.log(credentials);

    const token = await (await this.fireAuth.currentUser)?.getIdToken();
    const token2 = await (await this.fireAuth.currentUser)?.getIdTokenResult();
    console.log(token, token2);

    if (token) this.ws.send(token);
    else console.log('Firebase token is undefined');
  }
}
