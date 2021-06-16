import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Yatga';

  constructor(private fireAuth: AngularFireAuth) {
  }

  async signIn() {
    console.log('CALL 911');
    
    const provider = new firebase.auth.GoogleAuthProvider();
    const credentials: firebase.auth.UserCredential = await this.fireAuth.signInWithPopup(provider);
    console.log(credentials);

    const token = (await this.fireAuth.currentUser)?.getIdToken();
    const token2 = (await this.fireAuth.currentUser)?.getIdTokenResult();
    console.log(token, token2);
    console.log('BUT NOT FOR ME');
  }
}
