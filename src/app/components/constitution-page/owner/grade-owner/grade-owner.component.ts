import { Component, Input } from '@angular/core';
import { Constitution, EMPTY_CONSTITUTION, GradeSummary, Song, User } from 'chelys';

enum GradeState {
	SONGS_AND_VOTES,
	ONLY_VOTES,
	RESULTS
}

@Component({
	selector: 'app-grade-owner',
	templateUrl: './grade-owner.component.html',
	styleUrls: ['./grade-owner.component.scss']
})
export class GradeOwnerComponent {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map(); // TODO utile la map ?
	@Input() songs: Map<number, Song> = new Map();
	@Input() summary: GradeSummary = { voteCount: 0 };

	constructor() { }

	numberOfVotes(): number {
		return this.constitution.maxUserCount * this.constitution.numberOfSongsPerUser * (this.constitution.maxUserCount - 1);
	}

	votesProgressBarValue(): number {
		return this.summary.voteCount / this.numberOfVotes() * 100;
	}

}
