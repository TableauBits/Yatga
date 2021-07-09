import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AuthService } from './services/auth.service';
import { createMessage, EventTypes } from './types/message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private fireAuth: AngularFireAuth, private auth: AuthService) {}

  async signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await this.fireAuth.signInWithPopup(provider);
    const token = await (await this.fireAuth.currentUser)?.getIdToken();
    
    const emitter = this.auth.signIn(token);

    emitter.on('authenticate', () => {
      const getCurrentUserMessage = createMessage(EventTypes.USER_get_one, {uid: this.auth.uid});
      this.auth.ws.send(getCurrentUserMessage);
    })
  }
}
