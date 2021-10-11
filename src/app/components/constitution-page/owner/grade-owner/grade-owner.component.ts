import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constitution, createMessage, EMPTY_CONSTITUTION, EventType, extractMessageData, GradeReqGetSummary, GradeResSummaryUpdate, GradeSummary, Message, Song, User } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';

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
	summary: GradeSummary = { voteCount: 0 };
	cstID = "";

	constructor(private auth: AuthService, private route: ActivatedRoute) {
		this.auth.waitForAuth(this.handleEvents, this.onConnect, this);
	}

	private onConnect(): void {
		this.route.params.subscribe((params) => {
			this.cstID = params.cstID;  
      const messageGetSummary = createMessage<GradeReqGetSummary>(EventType.CST_SONG_GRADE_get_summary, { cstId: this.cstID});
      this.auth.ws.send(messageGetSummary);
    });
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
    
    switch (message.event) { 
			case EventType.CST_SONG_GRADE_summary_update: 
			this.summary = extractMessageData<GradeResSummaryUpdate>(message).summary;
			break;
		}
	}

	numberOfVotes(): number {
		return this.constitution.maxUserCount * this.constitution.numberOfSongsPerUser * (this.constitution.maxUserCount - 1);
	}

	votesProgressBarValue(): number {
		return this.summary.voteCount / this.numberOfVotes() * 100;
	}

}
