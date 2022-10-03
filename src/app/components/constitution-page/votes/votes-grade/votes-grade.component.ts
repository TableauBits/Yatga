import { Component, Input, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { areResultsPublic, canModifySongs, Constitution, createMessage, FavReqAdd, FavReqRemove, CstResUpdate, EMPTY_CONSTITUTION, EMPTY_USER, EventType, extractMessageData, FAVORITES_MAX_LENGTH, GradeReqGetSummary, GradeReqGetUser, GradeResSummaryUpdate, GradeResUserDataUpdate, GradeSummary, GradeUserData, Message, Song, SongPlatform, User, UserFavorites, canModifyVotes } from 'chelys';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY, GRADE_SHOW_STATS_KEY, GRADE_ALREADY_VOTES_KEY } from 'src/app/types/local-storage';
import { mean, variance } from 'src/app/types/math';
import { compareSongASC, compareSongDSC, compareSongUser } from 'src/app/types/song';
import { getEmbedURL, getIDFromURL } from 'src/app/types/url';
import { VoteNavigatorComponent } from './vote-navigator/vote-navigator.component';
import { ActivatedRoute } from '@angular/router';
import { toMap, toMapNumber } from 'src/app/types/utils';

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
export class VotesGradeComponent implements OnDestroy {

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
		private auth: AuthService,
		private sanitizer: DomSanitizer,
		private dialog: MatDialog,
		private route: ActivatedRoute,
	) {
		this.currentIframeSongID = -1;
		this.votes = { uid: this.auth.uid, values: new Map() };
		this.summary = { voteCount: 0, userCount: new Map() };
		this.favorites = {uid: "", favs: []};
		this.histogramGrades = [];
		this.cardsSortASC = (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "false";
		this.cardsViewEnabled = (localStorage.getItem(CARDS_VIEW_KEY) ?? true) !== "false"
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
		let songsToVote = Array.from(this.songs.values()).filter(song => {
			const isNotUserSong = song.user !== this.auth.uid;
			const isAlreadyVoted = this.votes.values.has(song.id) && this.showAlreadyVoted
			return isNotUserSong && !isAlreadyVoted && this.isSelected(song.user);
		});

		if (this.cardsSortASC) songsToVote = songsToVote.sort(compareSongASC)
		else songsToVote = songsToVote.sort(compareSongDSC);

		if (this.orderByUser) songsToVote = songsToVote.sort(compareSongUser);

		if (this.orderByGrade !== GradeOrder.NONE) songsToVote = songsToVote.sort((s1, s2) => {
			const order = this.orderByGrade === GradeOrder.INCREASE ? 1 : -1;

			const g1 = this.getVote(s1) || 0;
			const g2 = this.getVote(s2) || 0;

			if (g1 > g2) return order;
			if (g1 < g2) return -order;

			return 0;
		})

		if (this.orderByFavs) songsToVote = songsToVote.sort((a, b) => {
			if (this.isAFavorite(a)) return -1;
			if (this.isAFavorite(b)) return 1;
			return 0;
		})

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
		const meanValue = mean(values).toFixed(3)
		return meanValue === 'NaN' ? '0.000' : meanValue;
	}

	getVar(): string {
		const values = Array.from(this.votes.values).map((value) => value[1]);
		return variance(mean(values), values).toFixed(3);
	}

	openVoteNavigator(song: Song): void {
		const config = new MatDialogConfig();

		config.data = {
			cstId: this.constitution.id,
			currentSong: song,
			currentVote: this.getVote(song),
			songs: this.getSongsToVote(),
			votes: this.votes,
			favorites: this.favorites
		}

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

	getImageURL(song: Song): string {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const videoID = getIDFromURL(song);
				return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
			}
		}
	}

	getSongSafeURL(song: Song): SafeResourceUrl {
		if (!this.safeUrls.has(song.id)) {
			this.safeUrls.set(song.id, getEmbedURL(song, this.sanitizer));
		}

		return this.safeUrls.get(song.id) || '';
	}

	updateCurrentIframeSong(song: Song): void {
		this.currentIframeSongID = song.id;
	}

	// FILTER FUNCTIONS
	toggleUserFilter(uid: string): void {
		const index = this.selectedUsers.findIndex((user) => { return user === uid });
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
		this.setOrderByGrade(GradeOrder.NONE)
	}

	// TODO : Implement class ?
	isAFavorite(song: Song): boolean {
		return this.favorites.favs.includes(song.id);
	}

	toggleFavorite(song: Song): void {
		let message: string;

		if (this.favorites.favs.includes(song.id)) {
			// remove the song from favorites
			message = createMessage<FavReqRemove>(EventType.CST_SONG_FAV_remove, { cstId: this.constitution.id, songId: song.id });
		} else {
			// add the song to the favorites
			message = createMessage<FavReqAdd>(EventType.CST_SONG_FAV_add, { cstId: this.constitution.id, songId: song.id });
		}

		this.auth.ws.send(message);
	}

	noMoreFavorties(song: Song): boolean {
		return FAVORITES_MAX_LENGTH === this.favorites.favs.length && !this.favorites.favs.includes(song.id);
	}

}
