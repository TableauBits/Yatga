import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EventEmitter } from 'events';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import { CltReqAuthenticate, CltReqPing, createMessage, EMPTY_USER, EventType, extractMessageData, Message, ResponseStatus, User, UsrReqGet, UsrResUpdate } from 'chelys';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

const WS_PING_INTERVAL = 30 * 1000; // Every 30 seconds
const HTTP_PING_INTERVAL = 10 * 60 * 1000;	// Every 10 minutes

function* lyrics() {
	while (true) {
		yield "Tell me why you did it, every dream falling apart";
		yield "Tell me why you did it after the promise";
		yield "Still aching, still aching, oh baby I need your love";
		yield "Looking so different, glaring street light";
		yield "Heartbeat, heartbeat, it keeps on pounding";
		yield "Heartbreak, heartbreak, you tell me goodbye";
		yield "Heartbeat, heartbeat, it keeps on pounding";
		yield "Heartbreak, heartbreak, you tell me goodbye";
		yield "Heartbeat, heartbeat, it keeps on pounding";
		yield "Heartbreak, heartbreak, you tell me goodbye";
		yield "Heartbeat, heartbeat, it keeps on pounding";
		yield "Heartbreak, heartbreak, you tell me goodbye";
		yield "Tell me why you did it, every dream falling apart";
		yield "Tell me why you did it after the promise";
		yield "Still aching, still aching, oh baby I need your love";
		yield "Looking so different, glaring street light";
		yield "Heartbeat, heartbeat, it keeps on pounding";
		yield "Heartbreak, heartbreak, you tell me goodbye";
		yield "Heartbeat, heartbeat, it keeps on pounding";
		yield "Heartbreak, heartbreak, you tell me goodbye";
		yield "Heartbeat, heartbeat, it keeps on pounding";
		yield "Heartbreak, heartbreak, you tell me goodbye";
		yield "Heartbeat, heartbeat, it keeps on pounding";
		yield "Heartbreak, heartbreak, you tell me goodbye";
	}
}
const lyricGenerator = lyrics();

function pingWS(ws: WebSocket): void {
	const lyric = lyricGenerator.next().value;
	ws.send(createMessage<CltReqPing>(EventType.CLIENT_ping, { data: lyric || "You'll never see it coming" }));
	if (!environment.production) {
		console.log(lyric);
	}
	setTimeout(pingWS, WS_PING_INTERVAL, ws);
}

function pingHTTP(http: HttpClient, url: string): void {
	http.get(url).subscribe();

	setTimeout(pingHTTP, HTTP_PING_INTERVAL, http, url);
}

type EventHandlerFunction = (event: MessageEvent<any>) => void;
type AuthCallbackFunction = () => void;

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	// Communication and Events
	public WSconnectionURL: string;
	public HTTPconnectionURL: string;
	public ws: WebSocket;
	public emitter: EventEmitter;
	public isConnected: boolean;

	// Current User infos
	public uid: string;
	public user: User;
	public isAuthenticate: boolean;

	// Callbacks
	private eventHandlers: [EventHandlerFunction, any][];
	private authCallbacks: [AuthCallbackFunction, any][];

	constructor(
		private fireAuth: AngularFireAuth,
		private title: Title,
		private http: HttpClient
	) {
		this.isAuthenticate = false;
		this.isConnected = false;
		this.uid = '';
		this.user = EMPTY_USER;
		this.emitter = new EventEmitter();

		this.eventHandlers = [[this.updateUserData, this]];
		this.authCallbacks = [];

		this.WSconnectionURL = `${environment.protocolWebSocket}${environment.serverAPI}:${environment.portWebSocket}`;
		this.HTTPconnectionURL = `${environment.protocolHTTP}${environment.serverAPI}:${environment.portWebSocket}`;
		if (!environment.production) {
			console.warn("Debug mode enabled! Yatga will attempt to connect to: ", this.WSconnectionURL, this.HTTPconnectionURL);
		}


		this.ws = new WebSocket(this.WSconnectionURL);
		this.ws.onopen = () => {
			this.fireAuth.authState.subscribe(async user => {
				if (user) {
					const clientAuthenticateMessage = createMessage<CltReqAuthenticate>(EventType.CLIENT_authenticate, { idToken: await user.getIdToken() });
					this.ws.send(clientAuthenticateMessage);
					this.emitter.once('authenticate', () => {
						const getCurrentUserMessage = createMessage<UsrReqGet>(EventType.USER_get, { uids: [user.uid] });
						this.ws.send(getCurrentUserMessage);
					});
				}
			});
		};

		this.ws.onmessage = (event) => {
			this.handleEvents(event);
		};
	}

	private resetState(): void {
		this.isAuthenticate = false;
		this.uid = '';
		this.user = EMPTY_USER;

		this.ws = new WebSocket(this.WSconnectionURL);

		this.ws.onmessage = (event) => {
			this.handleEvents(event);
		};
	}

	async signIn(): Promise<void> {
		const provider = new firebase.auth.GoogleAuthProvider();
		await this.fireAuth.signInWithPopup(provider);

		this.emitter.once('authenticate', () => {
			const getCurrentUserMessage = createMessage<UsrReqGet>(EventType.USER_get, { uids: [this.uid] });
			this.ws.send(getCurrentUserMessage);
		});
	}

	async signOut(): Promise<void> {
		await this.fireAuth.signOut();
		this.ws.close();
		this.resetState();
	}

	private updateUserData(event: MessageEvent<any>): void {
		let message: Message<unknown>;
		try {
			message = JSON.parse(event.data.toString()) as Message<unknown>;
		} catch (error: unknown) {
			console.error(`Could not parse event (${event})!`);
			return;
		}

		const data = extractMessageData<UsrResUpdate>(message);

		if (message.event === EventType.USER_update &&
			this.uid === data.userInfo.uid) {
			this.user = data.userInfo;
		}
	}

	pushEventHandler(eventHandler: EventHandlerFunction, context: any): void {
		this.eventHandlers.push([eventHandler, context]);
	}
	pushAuthFunction(authCallback: AuthCallbackFunction, context: any): void {
		if (this.isAuthenticate) {
			authCallback.call(context);
		} else {
			this.authCallbacks.push([authCallback, context]);
		}
	}

	popEventHandler(): void { this.eventHandlers.pop(); }
	popAuthCallback(): void { this.authCallbacks.pop(); }

	private handleEvents(event: MessageEvent<any>): void {
		let message: Message<unknown>;
		try {
			message = JSON.parse(event.data.toString()) as Message<unknown>;
		} catch (error: unknown) {
			console.error(`Could not parse event (${event})!`);
			return;
		}

		switch (message.event) {
			case EventType.CLIENT_authenticate:
				const response = message.data as ResponseStatus;

				if (response.success) {
					this.uid = response.status;
					this.emitter.emit('authenticate');
				} else console.error(message.data as ResponseStatus);

				break;

			case EventType.USER_update:
				this.isAuthenticate = true;
				this.isConnected = true;
				this.user = extractMessageData<UsrResUpdate>(message).userInfo;
				this.ws.onmessage = (event): any => { this.eventHandlers.forEach((eventHandler) => eventHandler[0].call(eventHandler[1], event)); };
				this.ws.onclose = () => {
					this.isConnected = false;
					this.title.setTitle(this.title.getTitle() + " [OFFLINE]");
				};
				this.authCallbacks.forEach((callback) => callback[0].call(callback[1]));
				pingWS(this.ws);
				pingHTTP(this.http, `${this.HTTPconnectionURL}/keep-alive`);
				break;

			default:
				console.log(`Receive an unknown event : ${message.event}`);
				break;
		}
	}
}
