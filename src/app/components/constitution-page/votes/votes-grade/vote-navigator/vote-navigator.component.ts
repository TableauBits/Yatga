import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { createMessage, EventType, extractMessageData, GradeReqEdit, GradeResUserDataUpdate, GradeUserData, Message, Song } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { getEmbedURL } from 'src/app/types/url';
import { toMapNumber } from 'src/app/types/utils';

interface VoteNavigatorInjectedData {
	cstId: string,
	currentSong: Song,
	songs: Song[],
	currentVote: number,
	votes: GradeUserData,
}

@Component({
	selector: 'app-vote-navigator',
	templateUrl: './vote-navigator.component.html',
	styleUrls: ['./vote-navigator.component.scss']
})
export class VoteNavigatorComponent implements OnDestroy {

	cstId: string;

	currentSong: Song;
	currentSongSafeURL: SafeResourceUrl;
	currentVote: number | undefined;

	songs: Song[];
	votes: GradeUserData;

	constructor(
		private auth: AuthService,
		private sanitizer: DomSanitizer,
		private dialogRef: MatDialogRef<VoteNavigatorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: VoteNavigatorInjectedData
	) {
		this.cstId = data.cstId;
		this.currentSong = data.currentSong;
		this.currentVote = data.currentVote;
		this.songs = data.songs;
		this.votes = data.votes;
		this.currentSongSafeURL = getEmbedURL(this.currentSong, this.sanitizer);

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
		}
	}

	vote(grade: number) {
		const message = createMessage<GradeReqEdit>(EventType.CST_SONG_GRADE_edit, { cstId: this.cstId, voteData: { grade: grade, songId: this.currentSong.id } });
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
		this.currentSongSafeURL = getEmbedURL(this.currentSong, this.sanitizer);
	}

	closeWindow(): void {
		this.dialogRef.close();
	}

}
