import { Component, OnDestroy } from '@angular/core';
import {
	Constitution, createMessage,
	CstReqGetFromUser, CstReqJoin, CstReqUnsubscribe, CstResUpdate,
	EMPTY_USER, EventType, extractMessageData, Message, User,
	UsrReqGet, UsrReqUnsubscribe, UsrResUpdate
} from 'chelys';
import { AuthService } from 'src/app/services/auth.service';

const OWNER_INDEX = 0;

enum ConstitutionStatus {
	JOINABLE = "JOINABLE",
	JOINED = "JOINED",
	FULL = "FULL",
}

interface DisplayData {
	constitution: Constitution,
	owner: User,
}

function compareConstitutionASC(c1: DisplayData, c2: DisplayData): number {
	if (c1.constitution.season > c2.constitution.season) { return 1; }
	if (c1.constitution.season < c2.constitution.season) { return -1; }
	else {
		if (c1.constitution.part > c2.constitution.part) { return 1; }
		if (c1.constitution.part < c2.constitution.part) { return -1; }
	}
	return 0;
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
		this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
	}

	ngOnDestroy() {
		const uids: Set<string> = new Set();	// unsubsribe owners
		const ids: Set<string> = new Set();		// unsubscribe constitutions

		this.constitutions.forEach((data) => {
			uids.add(data.owner.uid);
			ids.add(data.constitution.id);
		});

		uids.delete(this.auth.uid);

		this.auth.ws.send(createMessage<UsrReqUnsubscribe>(EventType.USER_unsubscribe, { uids: Array.from(uids.values()) }));
		this.auth.ws.send(createMessage<CstReqUnsubscribe>(EventType.CST_unsubscribe, { ids: Array.from(ids.values()) }));

		this.auth.popEventHandler();
		this.auth.popAuthCallback();
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
		switch (message.event) {
			case EventType.CST_update: {
				const data = extractMessageData<CstResUpdate>(message).cstInfo;
				const refConstitution = this.constitutions.get(data.id);

				if (refConstitution?.constitution.users !== data.users && data.users.length > 0) {
					this.auth.ws.send(createMessage<UsrReqGet>(EventType.USER_get, { uids: [data.users[OWNER_INDEX]] }));
				}
				this.constitutions.set(data.id, { constitution: data, owner: refConstitution ? refConstitution.owner : EMPTY_USER });
			} break;

			case EventType.USER_update: {
				const user = extractMessageData<UsrResUpdate>(message).userInfo;
				this.constitutions.forEach((data) => {
					if (data.constitution.users[OWNER_INDEX] === user.uid) {
						data.owner = user;
					}
				});
			} break;

			default: { } break;
		};

	}

	private onConnect(): void {
		this.auth.ws.send(createMessage<CstReqGetFromUser>(EventType.CST_get_from_user, {}));
	}

	getConstitutions(): DisplayData[] {
		return Array.from(this.constitutions.values()).sort(compareConstitutionASC);
	}

	getStatus(constitution: Constitution): ConstitutionStatus {
		if (constitution.users.includes(this.auth.uid))
			return ConstitutionStatus.JOINED;
		if (constitution.users.length < constitution.maxUserCount)
			return ConstitutionStatus.JOINABLE;
		return ConstitutionStatus.FULL;
	}

	joinConstitution(data: DisplayData) {
		this.auth.ws.send(createMessage<CstReqJoin>(EventType.CST_join, { id: data.constitution.id }));
	}
}
