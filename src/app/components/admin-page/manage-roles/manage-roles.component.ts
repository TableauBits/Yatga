import { Component, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { createMessage, EventType, extractMessageData, Message, User, UsrReqUnsubscribe, UsrResUpdate } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { returnUserRoles, RoleData, USER_ROLES } from 'src/app/types/role';

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss']
})
export class ManageRolesComponent implements OnDestroy, OnChanges {

  public users: Map<string, User> = new Map();
  public roles2: Map<string, FormControl> = new Map();

  roles = new FormControl();
  rolesList: string[];

  constructor(private auth: AuthService) {
    this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);

    this.rolesList = Object.keys(USER_ROLES);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy() {
    // Unsubscribe from all user updates except the user himself
		// const uids: string[] = [...this.users.keys()].filter((uid) => uid !== this.auth.uid);
		// this.auth.ws.send(createMessage<UsrReqUnsubscribe>(EventType.USER_unsubscribe, { uids: uids }));

    this.auth.popEventHandler();
		this.auth.popAuthCallback();
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message = JSON.parse(event.data.toString()) as Message<unknown>;

    if (message.event === EventType.USER_update) {
      const data = extractMessageData<UsrResUpdate>(message).userInfo;
      this.users.set(data.uid, data)
      const userRole = new FormControl();
      userRole.setValue(data.roles);
      this.roles2.set(data.uid, userRole);
    }

  }

  private onConnect(): void {
    this.auth.ws.send(createMessage(EventType.USER_get_all, {}));
  }

  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  getRoles(user: User): RoleData[] {
		const roles = returnUserRoles(user.roles)
		return roles ? roles : [];
	}

  getUserForm(uid: string): FormControl {
    return this.roles2.get(uid) || new FormControl();
  }

  newSelection(uid: string) {
    console.log(this.roles2.get(uid));
  }

}
