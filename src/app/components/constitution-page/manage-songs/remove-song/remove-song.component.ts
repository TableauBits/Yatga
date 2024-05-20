import { Component, Input } from '@angular/core';
import { CstSongReqRemove, EventType, Song, createMessage } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-remove-song',
  templateUrl: './remove-song.component.html',
  styleUrls: ['./remove-song.component.scss']
})
export class RemoveSongComponent {
  @Input() songs: Map<number, Song> = new Map();
  @Input() cstID: string = "";

  constructor(
    private auth: AuthService,
  ) { }

  getUserSongs(): Song[] {
		const songValues = Array.from(this.songs.values());
		return songValues.filter((song) => song.user === this.auth.uid);
	}

  removeSong(id: number): void {
		const removeSongMessage = createMessage<CstSongReqRemove>(EventType.CST_SONG_remove, { cstId: this.cstID, songId: id });
		this.auth.ws.send(removeSongMessage);
	}

}
