
import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { canModifySongs, Constitution, createMessage, CstReqGet, CstResUpdate, CstSongReqGetAll, CstSongResUpdate, EMPTY_CONSTITUTION, EventType, extractMessageData, Message, OWNER_INDEX, Role, Song, User, UsrReqGet, UsrReqUnsubscribe, UsrResUpdate, FavResUpdate, FavReqGet, UserFavorites, CstSongReqUnsubscribe, FavReqUnsubscribe, FAVORITES_MAX_LENGTH } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { ManageSongsComponent } from './manage-songs/manage-songs.component';
import { RandomSongComponent } from './random-song/random-song.component';

enum ConstitutionSection {
	SONG_LIST = "songList",
	VOTES = "votes",
	OWNER = "owner",
	RESULTS = "results",
	EXPORT = "export",
	PARAMETERS = "parameters"
}

@Component({
	selector: 'app-constitution',
	templateUrl: './constitution.component.html',
	styleUrls: ['./constitution.component.scss']
})
export class ConstitutionComponent implements OnDestroy {

	// Page
	private cstID: string;
	private pageIsInit: boolean;
	currentSection: ConstitutionSection;

	// Firebase data
	constitution: Constitution;
	users: Map<string, User>;
	songs: Map<number, Song>;
	favorites: Map<string, UserFavorites>;

	constructor(
		private auth: AuthService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private _snackBar: MatSnackBar
	) {
		this.cstID = "";
		this.pageIsInit = false;
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

		const userUnsubscribe = createMessage<UsrReqUnsubscribe>(EventType.USER_unsubscribe, { uids: Array.from(this.users.values()).map((user) => user.uid) });
		this.auth.ws.send(userUnsubscribe);

		const songsUnsubscribe = createMessage<CstSongReqUnsubscribe>(EventType.CST_SONG_unsubscribe, { cstId: this.cstID });
		this.auth.ws.send(songsUnsubscribe);

		const favsUnsubscribe = createMessage<FavReqUnsubscribe>(EventType.CST_SONG_FAV_unsubscribe, { cstId: this.cstID });
		this.auth.ws.send(favsUnsubscribe);
	}

	// HTML can't access the ConstiutionSection enum directly
	public get constitutionSection(): typeof ConstitutionSection {
		return ConstitutionSection;
	}

	private onConnect(): void {
		this.route.params.subscribe((params) => {
			this.cstID = params.cstID;

			const getCSTMessage = createMessage<CstReqGet>(EventType.CST_get, { ids: [this.cstID] });
			this.auth.ws.send(getCSTMessage);
		});
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
						this.users.delete(uid);
					}

					const getUsersMessage = createMessage<UsrReqGet>(EventType.USER_get, { uids: newUsers });
					this.auth.ws.send(getUsersMessage);
					const unsubscribeUsersMessage = createMessage<UsrReqUnsubscribe>(EventType.USER_unsubscribe, { uids: unusedListens });
					this.auth.ws.send(unsubscribeUsersMessage);
					const getAllSongsMessage = createMessage<CstSongReqGetAll>(EventType.CST_SONG_get_all, { cstId: this.cstID });
					this.auth.ws.send(getAllSongsMessage);
					const getFavorites = createMessage<FavReqGet>(EventType.CST_SONG_FAV_get, { cstId: this.cstID });
					this.auth.ws.send(getFavorites);
				}

				if (!this.pageIsInit) {
					this.route.params.subscribe((params) => {
						const section = params.section === ConstitutionSection.OWNER && this.auth.uid !== this.constitution.users[OWNER_INDEX] ? ConstitutionSection.SONG_LIST : params.section;
						this.setCurrentSection(section);
					});

					this.pageIsInit = true;
				}

			} break;

			case EventType.USER_update: {
				const data = extractMessageData<UsrResUpdate>(message).userInfo;
				this.users.set(data.uid, data);
			} break;
			case EventType.CST_SONG_update: {
				const data = extractMessageData<CstSongResUpdate>(message);
				this.songUpdate(data);
			} break;

			case EventType.CST_SONG_FAV_update: {
				const favorites = extractMessageData<FavResUpdate>(message).userFavorites;
				this.favorites.set(favorites.uid, favorites);
			} break;

			case EventType.CST_delete: {
				this.router.navigateByUrl('current-constitutions');
				this.openSnackBar(`La constitution ${this.constitution.name} a été supprimée`, 'OK');
			} break;
		}
	}

	openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action, {
			horizontalPosition: 'right'
		});
	}

	private songUpdate(response: CstSongResUpdate) {
		const songInfo = response.songInfo;
		switch (response.status) {
			case "added": 
			case "modified":
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
			songs: this.songs
		};

		this.dialog.open(ManageSongsComponent, config);
	}

	openDialogRandomSong(): void {
		const config = new MatDialogConfig();

		config.data = {
			constitution: this.constitution,
			songs: Array.from(this.songs.values()),
			favorites: this.favorites.get(this.auth.uid),
		};

		this.dialog.open(RandomSongComponent, config);
	}

	setCurrentSection(newSection: ConstitutionSection): void {
		this.currentSection = newSection;
		this.router.navigate(['constitution', this.cstID, this.currentSection]);
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

	getCurrentUserFavs(): UserFavorites {
		return this.favorites.get(this.auth.uid) || {uid: "", favs: []};
	}
}
