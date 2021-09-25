import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createMessage, CstSongReqRemove, EventType, Song } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';

interface DeleteSongData {
	cstId: string,
	song: Song;
}

@Component({
	selector: 'app-delete-song-warning',
	templateUrl: './delete-song-warning.component.html',
	styleUrls: ['./delete-song-warning.component.scss']
})
export class DeleteSongWarningComponent {

	public song: Song;
	private cstId: string;

	constructor(
		private auth: AuthService,
		private dialogRef: MatDialogRef<DeleteSongWarningComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DeleteSongData) {
		this.song = data.song;
		this.cstId = data.cstId;
	}

	deleteSong() {
		const removeSongMessage = createMessage<CstSongReqRemove>(EventType.CST_SONG_remove, { cstId: this.cstId, songId: this.song.id });
		this.auth.ws.send(removeSongMessage);
		this.dialogRef.close();
	}

	closeWindow(): void {
		this.dialogRef.close();
	}

}
