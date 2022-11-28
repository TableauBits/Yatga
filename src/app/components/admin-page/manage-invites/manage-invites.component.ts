import { Component, OnDestroy } from '@angular/core';
import { Invite, User, createMessage, EventType, Message, extractMessageData, InvResUpdate, InvReqNew, InvReqGetAll, UsrResUpdate, UsrReqGet, EMPTY_USER, InvReqDelete } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-manage-invites',
  templateUrl: './manage-invites.component.html',
  styleUrls: ['./manage-invites.component.scss']
})
export class ManageInvitesComponent implements OnDestroy {
  public invites: Invite[] = [];
  public users: Map<string, User> = new Map();

  constructor(private auth: AuthService) {
    this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
  }

  ngOnDestroy() {
    this.auth.popEventHandler();
		this.auth.popAuthCallback();
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message = JSON.parse(event.data.toString()) as Message<unknown>;
		switch (message.event) {
      case EventType.INVITE_update: {
        const {invite, status} = extractMessageData<InvResUpdate>(message);
        
        if (status === "added") {
          this.invites.push(invite);
        } else if (status === "removed") {
          const index = this.invites.findIndex((i) => i.id === invite.id);
          this.invites.splice(index, 1);
        }

        this.invites.sort((i1, i2) => {
          if (i1.date > i2.date) return 1;
          if (i1.date < i2.date) return -1;
          return 0;
        });

        if (!this.users.has(invite.createdBy)) {
          const getUserMessage = createMessage<UsrReqGet>(EventType.USER_get, {uids: [invite.createdBy]});
          this.auth.ws.send(getUserMessage);
        }
        break;
      }
      case EventType.USER_update : {
        const user = extractMessageData<UsrResUpdate>(message).userInfo;
        this.users.set(user.uid, user);
        break;
      }
    }
  }

  private onConnect(): void {
    const getAllInvitesMessage = createMessage<InvReqGetAll>(EventType.INVITE_get_all, {});
    this.auth.ws.send(getAllInvitesMessage);
  }

  newInvite(): void {
    const newInviteMessage = createMessage<InvReqNew>(EventType.INVITE_new, {});
    this.auth.ws.send(newInviteMessage);
  }

  deleteInvite(invite: Invite): void {
    const deleteInviteMessage = createMessage<InvReqDelete>(EventType.INVITE_delete, {id: invite.id});
    this.auth.ws.send(deleteInviteMessage);
  }

  formatDate(d: string): string {
    const date = new Date(d);
    const hours = date.getHours().toString().length != 2 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes().toString().length != 2 ? '0' + date.getMinutes() : date.getMinutes();
    return `(${d.substring(0, 10)} à ${hours}:${minutes})`;
  }

  getUser(uid: string): User {
    return this.users.get(uid) || EMPTY_USER;
  }

}
