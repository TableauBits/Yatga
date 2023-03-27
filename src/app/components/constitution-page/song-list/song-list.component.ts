import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { canModifySongs, Constitution, EMPTY_CONSTITUTION, EMPTY_USER, Song, User, UserFavorites, canModifyVotes } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { YatgaUserFavorites } from 'src/app/types/extends/favorite';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY, LAST_IGNORE } from 'src/app/types/local-storage';
import { compareObjectsFactory } from 'src/app/types/utils';
import { DeleteSongWarningComponent } from '../../delete-song-warning/delete-song-warning.component';
import { SongNavigatorComponent } from './song-navigator/song-navigator.component';
import { GetUrlService } from 'src/app/services/get-url.service';
import { CardSongExtended } from '../../song-card/song-card.component';

@Component({
	selector: 'app-song-list',
	templateUrl: './song-list.component.html',
	styleUrls: ['./song-list.component.scss']
})
export class SongListComponent extends YatgaUserFavorites implements OnInit {

	apiLoaded = false;

	// Input
	@Input() constitution: Constitution;
	@Input() songs: Map<number, Song> = new Map();
	@Input() users: Map<string, User> = new Map();
	@Input() favorites: UserFavorites;

	// Iframe
	safeUrls: Map<number, SafeResourceUrl> = new Map();
	currentIframeSongID: number;

	// Local Parameter
	cardsViewEnabled: string;
	cardsSortASC: boolean;

	// Filter
	selectedUsers: string[];
	orderByUser: boolean;
	orderByFavs: boolean;

	songListening: CardSongExtended | null = null;
	showUpgradeMessage: boolean;

	constructor(
		public auth: AuthService,
		private dialog: MatDialog,
		public urlGetter: GetUrlService
	) {
		super();
		this.constitution = EMPTY_CONSTITUTION;
		this.currentIframeSongID = -1;
		this.favorites = { uid: "", favs: [] };

		if (!["card", "list", "card-new"].includes(localStorage.getItem(CARDS_VIEW_KEY) ?? '')) {
			localStorage.setItem(CARDS_VIEW_KEY, "card");
		}
		// Change date to today when you want to show the upgrade message again
		this.showUpgradeMessage = Number((localStorage.getItem(LAST_IGNORE) ?? 0)) < new Date(2023, 0, 1).getTime();
		this.cardsViewEnabled = (localStorage.getItem(CARDS_VIEW_KEY) ?? "card")
		this.cardsSortASC = (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "false";
		this.selectedUsers = Array.from(this.users.keys());
		this.orderByUser = false;
		this.orderByFavs = false;
	}

	removeUpgradeMessage() {
		this.showUpgradeMessage = false
		console.log(this.showUpgradeMessage)
		localStorage.setItem(LAST_IGNORE, new Date().getTime().toString());
	}

	ngOnInit() {
		if (!this.apiLoaded) {
			// This code loads the IFrame Player API code asynchronously, according to the instructions at
			// https://developers.google.com/youtube/iframe_api_reference#Getting_Started
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.body.appendChild(tag);
			this.apiLoaded = true;
		}
	}

	getSongs(): Song[] {
		let songs = Array.from(this.songs.values());

		songs = songs.filter(song => this.isSelected(song.user));

		songs.sort(compareObjectsFactory("id", !this.cardsSortASC));
		if (this.orderByUser)
			songs = songs.sort(compareObjectsFactory<Song>((s: Song) => this.users.get(s.user) + s.user, false));
		if (this.orderByFavs)
			songs = songs.sort(compareObjectsFactory<Song>((s: Song) => this.isAFavorite(s), true));

		return songs;
	}

	get newCardSongs(): CardSongExtended[] {
		return this.getSongs().map(s => ({
			videoId: s.url.toString().split("&")[0].slice(-11),
			id: s.id,
			songName: s.title,
			artistName: s.author,
			addedBy: this.getUser(s.user).displayName,
			liked: this.isAFavorite(s),
			playing: false,
		}));
	}

	getSongById(id: number): Song {
		return this.songs.get(id)!;
	}
	onVideoReady(event: any): void {
		event.target.playVideo();
	}

	onVideoStateChange(event: any): void {
		console.log(event);
		if (event.data === -1) {
			event.target.playVideo();
		}
	}
	getSongVideoId(song: Song): string {
		return song.url.toString().split("&")[0].slice(-11);
	}

	setSongListening(song: CardSongExtended | null): void {
		this.songListening = song;
	}

	getUsers(): User[] {
		return Array.from(this.users.values());
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

	isCurrentUserSong(song: Song): boolean {
		return song.user === this.auth.uid;
	}

	onNavigate(song: Song): void {
		window.open(song.url, "_blank");
	}

	openDeleteSongWarning(song: Song): void {
		const config = new MatDialogConfig();
		config.data = {
			song,
			cstId: this.constitution.id
		};
		this.dialog.open(DeleteSongWarningComponent, config);
	}

	openSongNavigator(song: Song): void {
		const config = new MatDialogConfig();

		config.data = {
			constitution: this.constitution,
			currentSong: song,
			songs: this.getSongs(),
			favorites: this.favorites,
		};

		this.dialog.open(SongNavigatorComponent, config);
		this.currentIframeSongID = -1;
	}

	canDeleteSong(): boolean {
		return canModifySongs(this.constitution);
	}

	canModifyFavorite(): boolean {
		return canModifyVotes(this.constitution);
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
	}

	userFilterTooltip(uid: string, displayName: string): string {
		const status = !this.selectedUsers.includes(uid) ? "Cacher" : "Afficher";
		return `${status} ${displayName}`;
	}
}
