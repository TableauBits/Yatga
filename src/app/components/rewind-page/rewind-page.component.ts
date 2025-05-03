import { Component } from '@angular/core';
import { createMessage, EMPTY_USER, EventType, extractMessageData, Message, RewindPerYear, RwdReqGet, RwdResUpdate, User, UsrReqGet, UsrResUpdate } from 'chelys';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rewind-page',
  templateUrl: './rewind-page.component.html',
  styleUrls: ['./rewind-page.component.scss']
})
export class RewindPageComponent {
  public rewinds: Map<number, RewindPerYear> = new Map();

  public selectedYear?: number;
  public selectedRewind?: RewindPerYear;

  private users: Map<string, User> = new Map();

  constructor(public auth: AuthService) {
    this.auth.pushAuthFunction(this.onConnect, this);
    this.auth.pushEventHandler(this.handleEvents, this);
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message = JSON.parse(event.data.toString()) as Message<unknown>;

    switch (message.event) {
      case EventType.REWIND_update: {
        const data = extractMessageData<RwdResUpdate>(message);

        this.rewinds.set(data.year, data.rewind);
        if (this.selectedYear === undefined || this.selectedYear < data.year) {
          this.selectedYear = data.year;
          this.selectedRewind = data.rewind;
        }
      } break;

      case EventType.USER_update: {
        const data = extractMessageData<UsrResUpdate>(message).userInfo;
        this.users.set(data.uid, data);
      } break;
    }
  }

  private onConnect(): void {
    this.auth.ws.send(
      createMessage(EventType.USER_get_all, {})
    );

    this.auth.ws.send(
      createMessage<RwdReqGet>(EventType.REWIND_get, { uid: this.auth.uid }));
  }

  getUser(uid: string): User {
    const user = this.users.get(uid);
    if (isNil(user)) return EMPTY_USER;
    return user;
  }

  selectYear(): void {
    const year = this.selectedYear;
    if (isNil(year)) return;
    this.selectedRewind = this.rewinds.get(year);
  }
}
