import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createMessage, CstSongReqAdd, CstSongReqRemove, CstSongResUpdate, EMPTY_SONG, EventType, extractMessageData, Message, Song, SongPlatform } from 'chelys';
import { isEmpty, isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { Status } from 'src/app/types/status';
import { DEFAULT_ID_FROM_URL, getIDFromURL } from 'src/app/types/url';

const SONG_NAME_LENGTH = 100;	// TODO : ADD TO CHELYS
const SONG_AUTHOR_LENGTH = 100;

interface ManageSongsInjectedData {
	cstID: string;
	songs: Map<number, Song>;
}

@Component({
	selector: 'app-manage-songs',
	templateUrl: './manage-songs.component.html',
	styleUrls: ['./manage-songs.component.scss']
})
export class ManageSongsComponent implements OnDestroy {

	public songs: Map<number, Song>;
	public newSongForm: FormGroup;
	public errorStatus: Status;
	private cstID: string;

	constructor(
		private auth: AuthService,
		private dialogRef: MatDialogRef<ManageSongsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ManageSongsInjectedData,
		public fb: FormBuilder,
	) {
		this.cstID = data.cstID;
		this.songs = data.songs;
		this.newSongForm = this.fb.group({
			title: [, Validators.required],
			author: [, Validators.required],
			url: [, Validators.required] // TODO : check if is a correct link
		});
		this.errorStatus = new Status();
		this.auth.pushEventHandler(this.handleEvents, this);
	}

	ngOnDestroy(): void {
		this.auth.popEventHandler();
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
		switch (message.event) {
			case EventType.CST_SONG_update:
				const data = extractMessageData<CstSongResUpdate>(message);
				this.songUpdate(data);
				break;
		}
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

	public checkFormValidity(): string[] {
		const keysForm = Object.keys(this.newSongForm.controls);
		const invalidKeys = [];

		for (const key of keysForm) {
			if (!this.newSongForm.controls[key].valid) {
				invalidKeys.push(key);
			};
		}

		return invalidKeys;
	}

	getUserSongs(): Song[] {
		const songValues = Array.from(this.songs.values());
		return songValues.filter((song) => song.user === this.auth.uid);
	}

	removeSong(id: number): void {
		const removeSongMessage = createMessage<CstSongReqRemove>(EventType.CST_SONG_remove, { cstId: this.cstID, songId: id });
		this.auth.ws.send(removeSongMessage);
	}

	addSong(): void {
		const invalidValues = this.checkFormValidity();
		if (!isEmpty(invalidValues)) {
			const text = `Certains champs sont invalides : ${invalidValues.join(', ')}`
			this.errorStatus.notify(text, true);
		} else {
			const song: Song = {
				id: -1,
				user: '',
				platform: SongPlatform.YOUTUBE,
				title: this.newSongForm.value['title'],
				author: this.newSongForm.value['author'],
				url: this.newSongForm.value['url']
			};

			const newSongMessage = createMessage<CstSongReqAdd>(EventType.CST_SONG_add, { cstId: this.cstID, songData: song });
			this.auth.ws.send(newSongMessage);
		}

		this.newSongForm.reset();
	}

	closeWindow(): void {
		this.dialogRef.close();
	}

	// VERIFY DATA
		// TODO : HTML faire un template ?

	isNil(key: string): boolean {
		return isNil(this.newSongForm.value[key]) || this.newSongForm.value[key] === '';
	}

	respectLengthLimit(key: string): boolean {
		if (isNil(this.newSongForm.value[key])) return false;
		
		switch (key) {
			case 'title':
				return this.newSongForm.value[key].length > SONG_NAME_LENGTH;
			case 'author':
				return this.newSongForm.value[key].length > SONG_AUTHOR_LENGTH;
		}
		return false;
	}

	showKalimbaValue(key: string): string {
		switch (key) {
			case 'title':
				return this.newSongForm.value[key].substring(0, SONG_NAME_LENGTH);
			case 'author':
				return this.newSongForm.value[key].substring(0, SONG_AUTHOR_LENGTH);
		}
		return '';
	}

	isNotValidURL(): boolean {
		if (isNil(this.newSongForm.value['url'])) return false;

		const song = EMPTY_SONG;
		song.platform = SongPlatform.YOUTUBE;
		song.url = this.newSongForm.value['url']

		return getIDFromURL(song) === DEFAULT_ID_FROM_URL;
	}
}
