import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Song } from '@tableaubits/hang';
import { Status } from 'src/app/types/status';

interface ManageSongsInjectedData {
  songs: Song[]
}

@Component({
  selector: 'app-manage-songs',
  templateUrl: './manage-songs.component.html',
  styleUrls: ['./manage-songs.component.scss']
})
export class ManageSongsComponent {

  private songs: Song[];
  public newSongForm: FormGroup;
  public errorStatus: Status;

  constructor(
    private dialogRef: MatDialogRef<ManageSongsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ManageSongsInjectedData,
    public fb: FormBuilder,
  ) {
    this.songs = [] // data.songs;
    this.newSongForm = this.fb.group({
      title: [, Validators.required],
      author: [, Validators.required],
      url: [, Validators.required] // TODO : check if is a correct link
    });
    this.errorStatus = new Status();
  }

  closeWindow(): void {
    this.dialogRef.close();
  }

}
