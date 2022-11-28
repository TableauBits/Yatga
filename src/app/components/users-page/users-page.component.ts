import { Component, OnDestroy } from '@angular/core';
import { createMessage, EventType, extractMessageData, Message, Role, User, UsrReqUnsubscribe, UsrResUpdate } from 'chelys';
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
		this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
	}

	ngOnDestroy(): void {
		// Unsubscribe from all user updates except the user himself
		const uids: string[] = [...this.users.keys()].filter((uid) => uid !== this.auth.uid);
		this.auth.ws.send(createMessage<UsrReqUnsubscribe>(EventType.USER_unsubscribe, { uids: uids }));

		this.auth.popEventHandler();
		this.auth.popAuthCallback();
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
		if (message.event !== EventType.USER_update) return;

		const data = extractMessageData<UsrResUpdate>(message).userInfo;

		this.users.set(data.uid, data);
	}

	private onConnect(): void {
		this.auth.ws.send(createMessage(EventType.USER_get_all, {}));
	}

	// TODO : À revoir si ajout de d'autres rôles
	getStaff(): User[] {
		return Array.from(this.users.values()).filter((user) => user.roles.includes((Role.ADMIN)));
	}

	getMember(): User[] {
		return Array.from(this.users.values()).filter((user) => !user.roles.includes((Role.ADMIN)) && user.roles.includes((Role.MEMBER)));
	}

	getTest(): User[] {
		return Array.from(this.users.values()).filter((user) => user.roles.includes((Role.TEST)));
	}

	getRoles(user: User): RoleData[] {
		const roles = returnUserRoles(user.roles);
		return roles ? roles : [];
	}
}
