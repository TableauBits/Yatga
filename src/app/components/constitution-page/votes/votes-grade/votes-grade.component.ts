import { Component, Input } from '@angular/core';
import { Constitution, EMPTY_CONSTITUTION, Song, User } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-votes-grade',
	templateUrl: './votes-grade.component.html',
	styleUrls: ['./votes-grade.component.scss']
})
export class VotesGradeComponent {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();

	constructor(private auth: AuthService) { }

	getSongsToVote(): Song[] {
		const songs = Array.from(this.songs.values())
		return songs.filter(song => song.user !== this.auth.uid);
	}

}
