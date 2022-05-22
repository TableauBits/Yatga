import { Component, OnDestroy } from '@angular/core';
import { createMessage, EMPTY_USER, EventType, extractMessageData, Message, PantheonReqGetAll, PantheonResUpdate, PantheonSong, SongPlatform, User, UsrReqGet, UsrResUpdate } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { getIDFromURL } from 'src/app/types/url';

@Component({
  selector: 'app-pantheon-page',
  templateUrl: './pantheon-page.component.html',
  styleUrls: ['./pantheon-page.component.scss']
})
export class PantheonPageComponent implements OnDestroy {

  pantheon: Map<string, PantheonSong>;
  users: Map<string, User>;

  ngOnDestroy(): void {
    this.auth.popEventHandler();
		this.auth.popAuthCallback();
  }

  constructor(private auth: AuthService) {
    this.pantheon = new Map();
    this.users = new Map();

    this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
  }

  private onConnect(): void {
    const getPantheonMessage = createMessage<PantheonReqGetAll>(EventType.PANTHEON_get_all, {});
    this.auth.ws.send(getPantheonMessage);
	}

  private handleEvents(event: MessageEvent<any>): void {
    let message = JSON.parse(event.data.toString()) as Message<unknown>;

    switch (message.event) {
      case EventType.PANTHEON_update: {
        // Receive new pantheon entry
        const data = extractMessageData<PantheonResUpdate>(message).pantheon;
        this.pantheon.set(data.id, data);
        console.log(data);

        // Get missing user info
        const missingUsers = data.users.filter((user) => !this.users.has(user));
        const getUsersMessage = createMessage<UsrReqGet>(EventType.USER_get, {uids: missingUsers});
        this.auth.ws.send(getUsersMessage);
      } break;
      case EventType.USER_update: {
        console.log('USER_update')
        const data = extractMessageData<UsrResUpdate>(message).userInfo;
        this.users.set(data.uid, data);
      } break;
    }
  }

  getUser(uid: string): User {
    return this.users.get(uid) || EMPTY_USER;
  }

  getPantheon(): PantheonSong[] {
    return Array.from(this.pantheon.values());
  }

  getImageURL(song: PantheonSong): string {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const videoID = getIDFromURL(song);
				return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
			}
		}
	}

}
