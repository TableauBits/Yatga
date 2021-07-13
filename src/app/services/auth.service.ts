import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { EventEmitter } from 'events';
import { environment } from 'src/environments/environment';
import { createMessage, EventTypes, Message, ResponseStatus } from '../types/message';
import { EMPTY_USER, User } from '../types/user';
import firebase from 'firebase/app';

type ResUserGetOne = {
  userInfo: User
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Communication and Events
  public connectionURL: string;
  public ws: WebSocket;
  public emitter: EventEmitter;

  // Current User infos
  public uid: string;
  public user: User;
  public isAuthenticate: boolean;

  constructor(private fireAuth: AngularFireAuth) {
    this.isAuthenticate = false;
    this.uid = '';
    this.user = EMPTY_USER;
    this.emitter = new EventEmitter();

    this.fireAuth.authState.subscribe(async user => {
      if (user) {
        const clientAuthenticateMessage = createMessage(EventTypes.CLIENT_authenticate, { idToken: await user.getIdToken() });
        this.ws.send(clientAuthenticateMessage);
        this.emitter.once('authenticate', () => {
          const getCurrentUserMessage = createMessage(EventTypes.USER_get_one, { uid: user.uid });
          this.ws.send(getCurrentUserMessage);
        })
      }
    });

    this.connectionURL = `${environment.protocolWebSocket}${environment.serverAPI}`;
    if (!environment.production) {
      this.connectionURL += `:${environment.portWebSocket}`;
      console.warn("Debug mode enabled! Yatga will attempt to connect to: ", this.connectionURL);
    }
    this.ws = new WebSocket(this.connectionURL)

    this.ws.onmessage = (event) => {
      this.handleEvents(event);
    }
  }

  resetState(): void {
    this.isAuthenticate = false;
    this.uid = '';
    this.user = EMPTY_USER;

    this.ws = new WebSocket(this.connectionURL)

    this.ws.onmessage = (event) => {
      this.handleEvents(event);
    }
  }

  async signIn(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    await this.fireAuth.signInWithPopup(provider);

    this.emitter.once('authenticate', () => {
      const getCurrentUserMessage = createMessage(EventTypes.USER_get_one, { uid: this.uid });
      this.ws.send(getCurrentUserMessage);
    })
  }

  async signOut(): Promise<void> {
    await this.fireAuth.signOut();
    this.ws.close();
    this.resetState();
  }

  waitForAuth(eventHandler: (event: MessageEvent<any>) => void, authCallback: () => void, context: any): void {
    this.emitter.once('user_get_one', () => {
      this.ws.onmessage = (event) => {
        eventHandler.call(context, event);
      }
      authCallback.call(context);
    });
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message: Message<unknown>;
    try {
      message = JSON.parse(event.data.toString()) as Message<unknown>;
    } catch (error: unknown) {
      console.error(`Could not parse event (${event})!`);
      return;
    }

    switch (message.event) {
      case EventTypes.CLIENT_authenticate:
        const response = message.data as ResponseStatus;

        if (response.success) {
          this.uid = response.status;
          this.emitter.emit('authenticate');
        } else console.error(message.data as ResponseStatus);

        break;

      case EventTypes.USER_get_one:
        this.isAuthenticate = true;
        this.user = (message.data as ResUserGetOne).userInfo;
        this.ws.onmessage = () => { }; // TODO: check if we need to do something else before
        this.emitter.emit('user_get_one');
        break;

      default:
        console.log(`Receive an unknown event : ${message.event}`)
        break;
    }
  }
}
