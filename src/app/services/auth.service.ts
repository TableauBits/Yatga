import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { EventEmitter } from 'events';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/app';
import { CltReqAuthenticate, CltReqPing, createMessage, EMPTY_USER, EventType, extractMessageData, Message, ResponseStatus, User, UsrReqGet, UsrResUpdate } from 'chelys';

const WS_PING_INTERVAL = 30000;

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

function ping(ws: WebSocket): void {
	const lyric = lyricGenerator.next().value;
	ws.send(createMessage<CltReqPing>(EventType.CLIENT_ping, { data: lyric || "You'll never see it coming" }));
	if (!environment.production) {
		console.trace(lyric);
	}
	setTimeout(ping, WS_PING_INTERVAL, ws);
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

		this.connectionURL = `${environment.protocolWebSocket}${environment.serverAPI}`;
		if (!environment.production) {
			this.connectionURL += `:${environment.portWebSocket}`;
			console.warn("Debug mode enabled! Yatga will attempt to connect to: ", this.connectionURL);
		}
		this.ws = new WebSocket(this.connectionURL)
		this.ws.onopen = () => {
			this.fireAuth.authState.subscribe(async user => {
				if (user) {
					const clientAuthenticateMessage = createMessage<CltReqAuthenticate>(EventType.CLIENT_authenticate, { idToken: await user.getIdToken() });
					this.ws.send(clientAuthenticateMessage);
					this.emitter.once('authenticate', () => {
						const getCurrentUserMessage = createMessage<UsrReqGet>(EventType.USER_get, { uids: [user.uid] });
						this.ws.send(getCurrentUserMessage);
					})
				}
			});
		};

		this.ws.onmessage = (event) => {
			this.handleEvents(event);
		}
	}

	private resetState(): void {
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
			const getCurrentUserMessage = createMessage<UsrReqGet>(EventType.USER_get, { uids: [this.uid] });
			this.ws.send(getCurrentUserMessage);
		})
	}

	async signOut(): Promise<void> {
		await this.fireAuth.signOut();
		this.ws.close();
		this.resetState();
	}

	private updateUser(message: Message<unknown>): void {
		const data = extractMessageData<UsrResUpdate>(message);

		if (message.event === EventType.USER_update &&
			this.uid === data.userInfo.uid) {
			this.user = data.userInfo;
		}
	}

	waitForAuth(eventHandler: (event: MessageEvent<any>) => void, authCallback: () => void, context: any): void {
		if (this.isAuthenticate) {
			this.ws.onmessage = (event) => {
				const message = JSON.parse(event.data.toString()) as Message<unknown>
				this.updateUser(message);
				eventHandler.call(context, event);
			}
			authCallback.call(context);
		} else {
			this.emitter.once('user_get_one', () => {
				this.ws.onmessage = (event) => {
					const message = JSON.parse(event.data.toString()) as Message<unknown>
					this.updateUser(message);
					eventHandler.call(context, event);
				}
				authCallback.call(context);
				ping(this.ws);
			});
		}
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
			case EventType.CLIENT_authenticate:
				const response = message.data as ResponseStatus;

				if (response.success) {
					this.uid = response.status;
					this.emitter.emit('authenticate');
				} else console.error(message.data as ResponseStatus);

				break;

			case EventType.USER_update:
				this.isAuthenticate = true;
				this.user = extractMessageData<UsrResUpdate>(message).userInfo;
				this.ws.onmessage = () => { }; // TODO: check if we need to do something else before
				this.emitter.emit('user_get_one');
				break;

			default:
				console.log(`Receive an unknown event : ${message.event}`)
				break;
		}
	}
}
