import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { createMessage, EMPTY_USER, EventType, extractMessageData, Message, PantheonReqGetAll, PantheonResUpdate, PantheonSong, SongPlatform, User, UsrReqGet, UsrResUpdate } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { getEmbedURL, getIDFromURL } from 'src/app/types/url';

function comparePantheonDSC(p1: PantheonSong, p2: PantheonSong): number {
	if (p1.season < p2.season) { return 1; }
	if (p1.season > p2.season) { return -1; }
	else {
		if (p1.part < p2.part) { return 1; }
		if (p1.part > p2.part) { return -1; }
	}
	return 0;
}

@Component({
  selector: 'app-pantheon-page',
  templateUrl: './pantheon-page.component.html',
  styleUrls: ['./pantheon-page.component.scss']
})
export class PantheonPageComponent implements OnDestroy {

  pantheon: Map<string, PantheonSong>;
  users: Map<string, User>;
  seasons: Set<number>;

  // Iframe
	safeUrls: Map<string, SafeResourceUrl>;
	currentIframeSongID: string;

  ngOnDestroy(): void {
    this.auth.popEventHandler();
		this.auth.popAuthCallback();
  }

  constructor(private auth: AuthService, private sanitizer: DomSanitizer) {
    this.pantheon = new Map();
    this.users = new Map();
    this.seasons = new Set();
    this.safeUrls = new Map();
    this.currentIframeSongID = '';

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
        this.seasons.add(data.season);

        // Get missing user info
        const missingUsers = data.users.filter((user) => !this.users.has(user));
        const getUsersMessage = createMessage<UsrReqGet>(EventType.USER_get, {uids: missingUsers});
        this.auth.ws.send(getUsersMessage);
      } break;
      case EventType.USER_update: {
        const data = extractMessageData<UsrResUpdate>(message).userInfo;
        this.users.set(data.uid, data);
      } break;
    }
  }

  getUser(uid: string): User {
    return this.users.get(uid) || EMPTY_USER;
  }

  getSeasons(): number[] {
    return Array.from(this.seasons.values()).sort().reverse();
  }

  getPantheon(): PantheonSong[] {
    return Array.from(this.pantheon.values()).sort(comparePantheonDSC);
  }

  getImageURL(song: PantheonSong): string {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const videoID = getIDFromURL(song);
				return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
			}
		}
	}

  getSongSafeURL(song: PantheonSong): SafeResourceUrl {
		if (!this.safeUrls.has(song.id)) {
			this.safeUrls.set(song.id, getEmbedURL(song, this.sanitizer));
		}
		return this.safeUrls.get(song.id) || '';
	}

  updateCurrentIframeSong(song: PantheonSong): void {
		this.currentIframeSongID = song.id;
	}

  onNavigate(song: PantheonSong): void {
		window.open(song.url, "_blank");
	}

}
