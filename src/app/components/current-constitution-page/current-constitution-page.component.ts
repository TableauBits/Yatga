import { Component, OnDestroy } from '@angular/core';
import { AuthService, ReqUserGet, ResUserUpdate } from 'src/app/services/auth.service';
import { Constitution } from 'src/app/types/constitution';
import { createMessage, EventTypes, Message } from 'src/app/types/message';
import { EMPTY_USER, User } from 'src/app/types/user';

type ReqCstGetFromUser = {}
type ReqCstUnsubscribe = {
	ids: string[]
}

type ResConstitutionUpdate = {
	cstInfo: Constitution;
};

enum ConstitutionStatus {
	JOINABLE = "JOINABLE",
	JOINED = "JOINED",
	FULL = "FULL",
}

interface DisplayData {
	constitution: Constitution,
	owner: User,
}

@Component({
	selector: 'app-current-constitution-page',
	templateUrl: './current-constitution-page.component.html',
	styleUrls: ['./current-constitution-page.component.scss']
})
export class CurrentConstitutionPageComponent implements OnDestroy {

	public constitutions: Map<string, DisplayData>;

	constructor(private auth: AuthService) {
		this.constitutions = new Map();
		auth.waitForAuth(this.handleEvents, this.onConnect, this);
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
		switch (message.event) {
			case EventTypes.CST_update: {
				const data = (message.data as ResConstitutionUpdate).cstInfo;

				if (!this.constitutions.has(data.id) && data.users.length > 0) {
					this.auth.ws.send(createMessage<ReqUserGet>(EventTypes.USER_get, { uids: [data.users[0]] }))
				}
				this.constitutions.set(data.id, { constitution: data, owner: EMPTY_USER })
			} break;

			case EventTypes.USER_update: {
				const user = (message.data as ResUserUpdate).userInfo;
				this.constitutions.forEach((data) => {
					if (data.constitution.users[0] === user.uid) {
						data.owner = user;
					}
				})
			} break;

			default: { } break;
		};

	}

	private onConnect(): void {
		this.auth.ws.send(createMessage<ReqCstGetFromUser>(EventTypes.CST_get_from_user, {}));
	}

	getConstitutions(): DisplayData[] {
		return Array.from(this.constitutions.values());
	}

	getStatus(constitution: Constitution): ConstitutionStatus {
		if (constitution.users.includes(this.auth.uid))
			return ConstitutionStatus.JOINED;
		if (constitution.users.length < constitution.maxUserCount)
			return ConstitutionStatus.JOINABLE;
		return ConstitutionStatus.FULL
	}

	ngOnDestroy() {
		const allUIDs: Set<string> = new Set();
		this.constitutions.forEach((data) => {
			allUIDs.add(data.owner.uid);
		})
		console.log(allUIDs);
		this.auth.ws.send(createMessage<ReqCstUnsubscribe>(EventTypes.CST_unsubscribe, { ids: Array.from(allUIDs.values()) }));
	}
}
