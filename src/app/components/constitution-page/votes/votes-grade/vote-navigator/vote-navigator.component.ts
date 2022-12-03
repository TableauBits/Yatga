import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { createMessage, FavResUpdate, EventType, extractMessageData, GradeReqEdit, GradeResUserDataUpdate, GradeUserData, Message, Song, UserFavorites, Constitution } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { GetUrlService } from 'src/app/services/get-url.service';
import { YatgaUserFavorites } from 'src/app/types/extends/favorite';
import { toMapNumber } from 'src/app/types/utils';

const NEXT_SHIFT = 1;
const PREVIOUS_SHIFT = -1;

interface VoteNavigatorInjectedData {
	constitution: Constitution,
	currentSong: Song,
	songs: Song[],
	currentVote: number,
	votes: GradeUserData,
	favorites: UserFavorites
}

@Component({
	selector: 'app-vote-navigator',
	templateUrl: './vote-navigator.component.html',
	styleUrls: ['./vote-navigator.component.scss']
})
export class VoteNavigatorComponent extends YatgaUserFavorites implements OnDestroy {

	constitution: Constitution;

	currentSong: Song;
	currentSongSafeURL: SafeResourceUrl;
	currentVote: number | undefined;

	songs: Song[];
	votes: GradeUserData;
	favorites: UserFavorites;

	constructor(
		public auth: AuthService,
		public urlGetter: GetUrlService,
		private dialogRef: MatDialogRef<VoteNavigatorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: VoteNavigatorInjectedData
	) {
		super();

		this.constitution = data.constitution;
		this.currentSong = data.currentSong;
		this.currentVote = data.currentVote;
		this.songs = data.songs;
		this.votes = data.votes;
		this.favorites = data.favorites;
		this.currentSongSafeURL = this.urlGetter.getEmbedURL(this.currentSong);

		this.auth.pushEventHandler(this.handleEvent, this);
	}

	ngOnDestroy(): void {
		this.auth.popEventHandler();
	}

	handleEvent(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;

		switch (message.event) {
			case EventType.CST_SONG_GRADE_userdata_update: {
				const data = extractMessageData<GradeResUserDataUpdate>(message).userData;
				this.votes = { uid: data.uid, values: toMapNumber<number>(data.values) };
			} break;
			case EventType.CST_SONG_FAV_update: {
				const favorites = extractMessageData<FavResUpdate>(message).userFavorites;
				if (favorites.uid === this.auth.uid) this.favorites = favorites;
			}
		}
	}

	vote(grade: number) {
		const message = createMessage<GradeReqEdit>(EventType.CST_SONG_GRADE_edit, { cstId: this.constitution.id, voteData: { grade: grade, songId: this.currentSong.id } });
		this.auth.ws.send(message);
		this.currentVote = grade; // TODO : Necessary ?
	}

	array(n: number): any[] {
		return Array(n);
	}

	isSelected(grade: number): boolean {
		return grade + 1 === this.currentVote;
	}

	previousSongExist(): boolean {
		const index = this.songs.lastIndexOf(this.currentSong);
		return index - 1 >= 0;
	}

	nextSongExist(): boolean {
		const index = this.songs.lastIndexOf(this.currentSong);
		return index + 1 < this.songs.length;
	}

	changeSong(shift: number): void {
		const currentIndex = this.songs.lastIndexOf(this.currentSong);

		this.currentSong = this.songs[currentIndex + shift];
		this.currentVote = this.votes.values.get(this.currentSong.id);
		this.currentSongSafeURL = this.urlGetter.getEmbedURL(this.currentSong);
	}

	keyPressed(keyEvent: KeyboardEvent): void {
    if (keyEvent.key === 'ArrowRight' && this.nextSongExist()) {
      this.changeSong(NEXT_SHIFT);
    }
    else if (keyEvent.key === 'ArrowLeft' && this.previousSongExist()) {
      this.changeSong(PREVIOUS_SHIFT);
    }
  }

	closeWindow(): void {
		this.dialogRef.close();
	}

}
