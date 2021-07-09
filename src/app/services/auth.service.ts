import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { environment } from 'src/environments/environment';
import { createMessage, EventTypes, Message, ResponseStatus } from '../types/message';
import { EMPTY_USER, User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public ws: WebSocket;
  public isAuthenticate: boolean;

  public uid: string;
  public currentUser: User;

  private emitter: EventEmitter;

  constructor() {
    this.isAuthenticate = false;
    this.uid = '';
    this.currentUser = EMPTY_USER;
    this.emitter = new EventEmitter();

    let connectionURL = `${environment.protocolWebSocket}${environment.serverAPI}`;
    if (!environment.production) {
      connectionURL += `:${environment.portWebSocket}`;
      console.warn("Debug mode enabled! Yatga will attempt to connect to: ", connectionURL);
    }
    this.ws = new WebSocket(connectionURL)

    this.ws.onmessage = (event) => {
      this.handleEvents(event);
    }
  }

  signIn(token: string | undefined) : EventEmitter{
    const clientAuthenticateMessage = createMessage(EventTypes.CLIENT_authenticate, {idToken: token});
    this.ws.send(clientAuthenticateMessage);

    return this.emitter;
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
          this.isAuthenticate = true;
          this.emitter.emit('authenticate');
        } else console.error(message.data as ResponseStatus);
        
        break;
  
      case EventTypes.USER_get_one:
        console.log(message);
        this.currentUser = message.data as User;
        break;
    
      default:
        console.log(`Receive an unknown event : ${message.event}`)
        break;
    }
  }
}
