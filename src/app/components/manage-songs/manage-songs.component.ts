import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createMessage, CstSongReqAdd, EventType, Song, SongPlatform } from '@tableaubits/hang';
import { isEmpty } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { Status } from 'src/app/types/status';

interface ManageSongsInjectedData {
  cstID: string,
  songs: Song[]
}

@Component({
  selector: 'app-manage-songs',
  templateUrl: './manage-songs.component.html',
  styleUrls: ['./manage-songs.component.scss']
})
export class ManageSongsComponent {

  public songs: Song[];
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
  }

  public checkFormValidity(): string[] {
		const keysForm = Object.keys(this.newSongForm.controls);
		const invalidKeys = [];

		for (const key of keysForm) {
			if (!this.newSongForm.controls[key].valid) {
				invalidKeys.push(key);
			} ;
		}

		return invalidKeys;
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

      const newSongMessage = createMessage<CstSongReqAdd>(EventType.CST_SONG_add, {cstId: this.cstID, songData: song });
      this.auth.ws.send(newSongMessage);
    }

    this.newSongForm.reset();
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
