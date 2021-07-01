import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import axios from 'axios';

import { io, Socket } from 'socket.io-client'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Yatga';

  socket: Socket;

  constructor(private fireAuth: AngularFireAuth) {
    this.socket = io('https://matbay-kalimba.herokuapp.com:3945');
    this.socket.emit('BONJOUR À TOUS', "C'EST ANGULAR BATAR");
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    
    this.socket.emit('my message', 'Hello there from Angular.');
  }

  async signIn() {
    console.log('CALL 911');
    
    const provider = new firebase.auth.GoogleAuthProvider();
    const credentials: firebase.auth.UserCredential = await this.fireAuth.signInWithPopup(provider);
    console.log(credentials);

    const token = await (await this.fireAuth.currentUser)?.getIdToken();
    const token2 = await (await this.fireAuth.currentUser)?.getIdTokenResult();
    console.log(token, token2);
    console.log('BUT NOT FOR ME');

    try {
      axios.get(`https://matbay-kalimba.herokuapp.com/auth/${token}`)
      .then(result => {
        console.log(result);
      });
    } catch (error) {
      console.log(error);
    }      
  }
}
