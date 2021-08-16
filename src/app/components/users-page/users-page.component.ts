import { Component, OnDestroy } from '@angular/core';
import { createMessage, EventType, extractMessageData, Message, User, UsrReqUnsubscribe, UsrResUpdate } from '@tableaubits/hang';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { returnUserRoles, RoleData } from 'src/app/types/role';

@Component({
	selector: 'app-users-page',
	templateUrl: './users-page.component.html',
	styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnDestroy {

	public users: Map<string, User>;

	constructor(public auth: AuthService) {
		this.users = new Map();
		this.auth.waitForAuth(this.handleEvents, this.onConnect, this);
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
		if (message.event !== EventType.USER_update) return;

		const data = extractMessageData<UsrResUpdate>(message).userInfo;

		this.users.set(data.uid, data)
	}

	private onConnect(): void {
		this.auth.ws.send(createMessage(EventType.USER_get_all, {}));
	}

	getUsers(filter?: string | undefined): User[] {
		const users = [];
		for (const user of this.users.values()) {
			if (isNil(filter)) users.push(user);
			else if (user.roles[0] === filter) users.push(user);
		}
		return users;
	}

	getRoles(user: User): RoleData[] {
		const roles = returnUserRoles(user.roles)
		return roles ? roles : [];
	}

	ngOnDestroy(): void {
		// Unsubscribe from all user updates except the user himself
		const uids: string[] = [...this.users.keys()].filter((uid) => uid !== this.auth.uid);
		this.auth.ws.send(createMessage<UsrReqUnsubscribe>(EventType.USER_unsubscribe, { uids: uids }));
	}
}
