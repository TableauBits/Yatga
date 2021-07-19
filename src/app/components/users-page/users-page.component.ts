import { Component, OnInit } from '@angular/core';
import { isNil } from 'lodash';
import { AuthService, ResUserUpdate } from 'src/app/services/auth.service';
import { createMessage, EventTypes, Message } from 'src/app/types/message';
import { returnUserRoles, Role, User } from 'src/app/types/user';

@Component({
	selector: 'app-users-page',
	templateUrl: './users-page.component.html',
	styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent {

	public users: Map<string, User>;

	constructor(public auth: AuthService) {
		this.users = new Map();
		this.auth.waitForAuth(this.handleEvents, this.onConnect, this);
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
		if (message.event !== EventTypes.USER_update) return;

		const data = (message.data as ResUserUpdate).userInfo;
	
		this.users.set(data.uid, data)
	}

	private onConnect(): void {
		this.auth.ws.send(createMessage(EventTypes.USER_get_all, {}));
	}

	getUsers(filter?: string | undefined): User[] {
		const users = [];
		for (const user of this.users.values()) {
			if (isNil(filter)) users.push(user);
			else if (user.roles[0] === filter) users.push(user);
		}
		return users;
	}

	getRoles(user: User): Role[] {
    const roles = returnUserRoles(user.roles)
    return roles ? roles : [];
  }
}
