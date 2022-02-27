
import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute} from '@angular/router';
import { canModifySongs, Constitution, createMessage, CstReqGet, CstResUpdate, CstSongReqGetAll, CstSongResUpdate, EMPTY_CONSTITUTION, EventType, extractMessageData, Message, OWNER_INDEX, Role, Song, User, UsrReqGet, UsrReqUnsubscribe, UsrResUpdate, CstFavResUpdate, CstFavReqGet, UserFavorites, CstSongReqUnsubscribe, CstFavReqUnsubscribe, FAVORITES_MAX_LENGTH } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { ManageSongsComponent } from './manage-songs/manage-songs.component';

enum ConstitutionSection {
	SONG_LIST,
	VOTES,
	OWNER,
	RESULTS,
	EXPORT,
	PARAMETERS
}

@Component({
	selector: 'app-constitution',
	templateUrl: './constitution.component.html',
	styleUrls: ['./constitution.component.scss']
})
export class ConstitutionComponent implements OnDestroy {

	private cstID;
	constitution: Constitution;
	users: Map<string, User>;
	currentSection: ConstitutionSection;
	songs: Map<number, Song>;
	favorites: Map<string, UserFavorites>;

	constructor(
		private auth: AuthService,
		private route: ActivatedRoute,
		private dialog: MatDialog,
	) {
		this.cstID = "";
		this.constitution = EMPTY_CONSTITUTION;
		this.currentSection = ConstitutionSection.SONG_LIST;
		this.users = new Map();
		this.songs = new Map();
		this.favorites = new Map();

		this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
	}

	ngOnDestroy(): void {
		this.auth.popEventHandler();
		this.auth.popAuthCallback();

		const userUnsubscribe = createMessage<UsrReqUnsubscribe>(EventType.USER_unsubscribe, {uids: Array.from(this.users.values()).map((user) => user.uid)});
		this.auth.ws.send(userUnsubscribe);

		const songsUnsubscribe = createMessage<CstSongReqUnsubscribe>(EventType.CST_SONG_unsubscribe, {cstId: this.cstID});
		this.auth.ws.send(songsUnsubscribe);

		const favsUnsubscribe = createMessage<CstFavReqUnsubscribe>(EventType.CST_FAV_unsubscribe, {cstId: this.cstID});
		this.auth.ws.send(favsUnsubscribe);
	}

	// HTML can't access the ConstiutionSection enum directly
	public get constitutionSection(): typeof ConstitutionSection {
		return ConstitutionSection;
	}

	private onConnect(): void {
		this.route.params.subscribe((params) => {
			this.cstID = params.cstID;

			const getCSTMessage = createMessage<CstReqGet>(EventType.CST_get, { ids: [this.cstID] })
			this.auth.ws.send(getCSTMessage);
		})
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
		switch (message.event) {
			case EventType.CST_update: {

				const data = extractMessageData<CstResUpdate>(message).cstInfo;
				if (data.id === this.cstID) {
					this.constitution = data;

					const newUsers = this.constitution.users.filter((uid) => !this.users.has(uid));
					const unusedListens = Array.from(this.users.values()).filter((user) => !this.constitution.users.includes(user.uid)).map((user) => user.uid);
					for (const uid of unusedListens) {
						this.users.delete(uid)
					}

					const getUsersMessage = createMessage<UsrReqGet>(EventType.USER_get, { uids: newUsers })
					this.auth.ws.send(getUsersMessage);
					const unsubscribeUsersMessage = createMessage<UsrReqUnsubscribe>(EventType.USER_unsubscribe, { uids: unusedListens });
					this.auth.ws.send(unsubscribeUsersMessage);
					const getAllSongsMessage = createMessage<CstSongReqGetAll>(EventType.CST_SONG_get_all, { cstId: this.cstID });
					this.auth.ws.send(getAllSongsMessage);
					const getFavorites = createMessage<CstFavReqGet>(EventType.CST_FAV_get, { cstId: this.cstID });
					this.auth.ws.send(getFavorites);
				}
			} break;

			case EventType.USER_update: {
				const data = extractMessageData<UsrResUpdate>(message).userInfo;
				this.users.set(data.uid, data)
			} break;
			case EventType.CST_SONG_update: {
				const data = extractMessageData<CstSongResUpdate>(message);
				this.songUpdate(data);
			} break;

			case EventType.CST_FAV_update: {
				const favorites = extractMessageData<CstFavResUpdate>(message).userFavorites;
				this.favorites.set(favorites.uid, favorites);
			} break;
		}
	}

	private songUpdate(response: CstSongResUpdate) {
		const songInfo = response.songInfo;
		switch (response.status) {
			case "added" || "modified":
				this.songs.set(songInfo.id, songInfo);
				break;
			case "removed":
				this.songs.delete(songInfo.id);
				break;
		}
	}

	openDialogManageSongs(): void {
		const config = new MatDialogConfig();

		config.data = {
			cstID: this.cstID,
			songs: Array.from(this.songs.values())
		}

		this.dialog.open(ManageSongsComponent, config);
	}

	setCurrentSection(newSection: ConstitutionSection): void {
		this.currentSection = newSection;
	}

	isSectionActive(section: ConstitutionSection): boolean {
		return section === this.currentSection;
	}

	isOwner(user?: User): boolean {
		if (user) return user.uid === this.constitution.users[OWNER_INDEX];
		else return this.auth.uid === this.constitution.users[OWNER_INDEX];
	}

	isAdmin(user: User): boolean {
		return user.roles.includes(Role.ADMIN);
	}

	getUsers(): User[] {
		return Array.from(this.users.values());
	}

	numberOfSongsOfCurrentUser(): number {
		return Array.from(this.songs.values()).filter(song => song.user === this.auth.uid).length;
	}

	numberOfCurrentUserFavorites(): number {
		return this.favorites.get(this.auth.uid)?.favs.length || 0;
	}

	numberOfMaxFavorites(): number {
		return FAVORITES_MAX_LENGTH;
	}

	updateSongs(): boolean {
		return canModifySongs(this.constitution);
	}
}
