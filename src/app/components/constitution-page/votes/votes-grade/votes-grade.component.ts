import { Component, Input, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { canModifySongs, Constitution, createMessage, CstResUpdate, EMPTY_CONSTITUTION, EMPTY_USER, EventType, extractMessageData, GradeReqGetSummary, GradeReqGetUser, GradeResSummaryUpdate, GradeResUserDataUpdate, GradeSummary, GradeUserData, Message, Song, SongPlatform, User, UserFavorites, canModifyVotes } from 'chelys';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY, GRADE_SHOW_STATS_KEY, GRADE_ALREADY_VOTES_KEY } from 'src/app/types/local-storage';
import { mean, variance } from 'src/app/types/math';
import { compareObjectsFactory, toMap, toMapNumber } from 'src/app/types/utils';
import { VoteNavigatorComponent } from './vote-navigator/vote-navigator.component';
import { ActivatedRoute } from '@angular/router';
import { YatgaUserFavorites } from 'src/app/types/extends/favorite';
import { GetUrlService } from 'src/app/services/get-url.service';

enum GradeOrder {
	INCREASE,
	DECREASE,
	NONE
}

@Component({
	selector: 'app-votes-grade',
	templateUrl: './votes-grade.component.html',
	styleUrls: ['./votes-grade.component.scss']
})
export class VotesGradeComponent extends YatgaUserFavorites implements OnDestroy {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
	@Input() favorites: UserFavorites;

	safeUrls: Map<number, SafeResourceUrl> = new Map();
	currentIframeSongID: number;

	votes: GradeUserData;
	histogramGrades: number[];
	summary: GradeSummary;

	cstID = "";

	cardsSortASC: boolean;
	cardsViewEnabled: boolean;
	showStats: boolean;
	showAlreadyVoted: boolean;

	// Filter
	selectedUsers: string[];	// TODO : Meilleur manière de filtrer ?
	orderByUser: boolean;
	orderByFavs: boolean;
	orderByGrade: GradeOrder;

	constructor(
		public auth: AuthService,
		private dialog: MatDialog,
		private route: ActivatedRoute,
		public urlGetter: GetUrlService
	) {
		super();

		this.currentIframeSongID = -1;
		this.votes = { uid: this.auth.uid, values: new Map() };
		this.summary = { voteCount: 0, userCount: new Map() };
		this.favorites = {uid: "", favs: []};
		this.histogramGrades = [];
		this.cardsSortASC = (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "false";
		this.cardsViewEnabled = (localStorage.getItem(CARDS_VIEW_KEY) ?? true) !== "false";
		this.showStats = (localStorage.getItem(GRADE_SHOW_STATS_KEY) ?? true) === "true";
		this.showAlreadyVoted = (localStorage.getItem(GRADE_ALREADY_VOTES_KEY) ?? true) === "true";
		this.selectedUsers = Array.from(this.users.keys());
		this.orderByUser = false;
		this.orderByFavs = false;
		this.orderByGrade = GradeOrder.NONE;

		this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
	}

	ngOnDestroy(): void {
		this.auth.popEventHandler();
		this.auth.popAuthCallback();
	}

	private onConnect(): void {
		this.route.params.subscribe((params) => {
			this.cstID = params.cstID;
			const messageGetUserVotes = createMessage<GradeReqGetUser>(EventType.CST_SONG_GRADE_get_user, { cstId: this.cstID });
			this.auth.ws.send(messageGetUserVotes);

			const messageGetSummary = createMessage<GradeReqGetSummary>(EventType.CST_SONG_GRADE_get_summary, { cstId: this.cstID });
			this.auth.ws.send(messageGetSummary);
		});
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;

		switch (message.event) {
			case EventType.CST_SONG_GRADE_summary_update: {
				const data = extractMessageData<GradeResSummaryUpdate>(message).summary;
				this.summary = { voteCount: data.voteCount, userCount: toMap(data.userCount) };
			}
				break;
			case EventType.CST_SONG_GRADE_userdata_update: {
				const data = extractMessageData<GradeResUserDataUpdate>(message).userData;
				this.votes = { uid: data.uid, values: toMapNumber<number>(data.values) };
				this.histogramGrades = Array.from(this.votes.values.values());
			}
				break;
			case EventType.CST_update: {
				const cst = extractMessageData<CstResUpdate>(message).cstInfo;
				if (cst.id !== this.constitution.id) return;
				this.constitution = cst;
			}
		}
	}

	updateGradeAlreadyVoted(): void {
		this.showAlreadyVoted = !this.showAlreadyVoted;
		localStorage.setItem(GRADE_ALREADY_VOTES_KEY, this.showAlreadyVoted.toString());
	}

	setOrderByGrade(order: GradeOrder | number): void {
		this.orderByGrade = order;
	}

	getSongsToVote(): Song[] {
		let songsToVote = Array.from(this.songs.values());

		songsToVote = songsToVote.filter(song => song.user !== this.auth.uid);
		songsToVote = songsToVote.filter(song => !(this.votes.values.has(song.id) && this.showAlreadyVoted));
		songsToVote = songsToVote.filter(song => this.isSelected(song.user));

		songsToVote.sort(compareObjectsFactory("id", !this.cardsSortASC));
		if (this.orderByUser) 
			songsToVote = songsToVote.sort(compareObjectsFactory<Song>((s:Song) => this.users.get(s.user) + s.user, false));
		if (this.orderByGrade !== GradeOrder.NONE)
			songsToVote = songsToVote.sort(compareObjectsFactory<Song>((s: Song) => this.getVote(s) || 0, this.orderByGrade == GradeOrder.DECREASE));
		if (this.orderByFavs)
			songsToVote = songsToVote.sort(compareObjectsFactory<Song>((s: Song) => this.isAFavorite(s), true));

		return songsToVote;
	}

	getGrades(): number[] {
		return Array.from(this.votes.values.values());
	}

	getVote(song: Song): number | undefined {
		return this.votes.values.get(song.id);
	}

	getMean(): string {
		const values = Array.from(this.votes.values).map((value) => value[1]);
		const meanValue = mean(values).toFixed(3);
		return meanValue === 'NaN' ? '0.000' : meanValue;
	}

	getVar(): string {
		const values = Array.from(this.votes.values).map((value) => value[1]);
		return variance(mean(values), values).toFixed(3);
	}

	openVoteNavigator(song: Song): void {
		const config = new MatDialogConfig();

		config.data = {
			constitution: this.constitution,
			currentSong: song,
			currentVote: this.getVote(song),
			songs: this.getSongsToVote(),
			votes: this.votes,
			favorites: this.favorites
		};

		this.dialog.open(VoteNavigatorComponent, config);
		this.currentIframeSongID = -1;
	}

	userVotesProgressBarValue(): number {
		return this.votes.values.size / (this.constitution.numberOfSongsPerUser * (this.constitution.maxUserCount - 1)) * 100;
	}

	totalVotesProgressBarValue(): number {
		return this.summary.voteCount / this.numberOfVotes() * 100;
	}

	getOtherUsers(): User[] {
		const users = Array.from(this.users.values());
		const currentUserIndex = users.findIndex((user) => user.uid === this.auth.uid);
		users.splice(currentUserIndex, 1);
		return users;
	}

	canModifySongs(): boolean {
		return canModifySongs(this.constitution);
	}

	canVote(): boolean {
		return canModifyVotes(this.constitution);
	}

	// TODO : Duplication de code //

	numberOfVotes(): number {
		return this.constitution.maxUserCount * this.constitution.numberOfSongsPerUser * (this.constitution.maxUserCount - 1);
	}

	getUser(uid: string): User {
		return this.users.get(uid) || EMPTY_USER;
	}

	getSongSafeURL(song: Song): SafeResourceUrl {
		if (!this.safeUrls.has(song.id)) {
			this.safeUrls.set(song.id, this.urlGetter.getEmbedURL(song));
		}

		return this.safeUrls.get(song.id) || '';
	}

	updateCurrentIframeSong(song: Song): void {
		this.currentIframeSongID = song.id;
	}

	// FILTER FUNCTIONS
	toggleUserFilter(uid: string): void {
		const index = this.selectedUsers.findIndex((user) => { return user === uid; });
		if (index !== -1) {
			this.selectedUsers.splice(index, 1);
		} else {
			this.selectedUsers.push(uid);
		}
	}

	isSelected(uid: string): boolean {
		return !this.selectedUsers.includes(uid);
	}

	select(mode: string): void {
		// TODO : wtf
		switch (mode) {
			case 'all':
				this.selectedUsers = [];
				break;
			case 'none':
				this.selectedUsers = Array.from(this.users.keys());
				break;
		}
	}

	setOrderByUser(order: boolean) {
		this.orderByUser = order;
	}

	setOrderByFavs(order: boolean) {
		this.orderByFavs = order;
	}

	resetOrder() {
		this.setOrderByUser(false);
		this.setOrderByFavs(false);
		this.setOrderByGrade(GradeOrder.NONE);
	}

	userFilterTooltip(uid: string, displayName: string): string {
		const status = !this.selectedUsers.includes(uid) ? "Cacher" : "Afficher";
		return `${status} ${displayName}`;
	}
}
