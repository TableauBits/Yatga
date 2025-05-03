import { Component } from '@angular/core';
import { createMessage, EventType, extractMessageData, Message, RewindPerYear, RwdReqGet, RwdResUpdate } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rewind-page',
  templateUrl: './rewind-page.component.html',
  styleUrls: ['./rewind-page.component.scss']
})
export class RewindPageComponent {

  public rewinds: Map<number, RewindPerYear> = new Map();

  constructor(public auth: AuthService) {
    this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message = JSON.parse(event.data.toString()) as Message<unknown>;
    if (message.event !== EventType.REWIND_update) return;

    const data = extractMessageData<RwdResUpdate>(message);

    this.rewinds.set(data.year, data.rewind);
  }

  private onConnect(): void {
    this.auth.ws.send(createMessage<RwdReqGet>(EventType.REWIND_get, {uid: this.auth.uid}));
  }

  listRewinds(): number[] {
    return Array.from(this.rewinds.keys());
  }
}
