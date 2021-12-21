import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constitution, createMessage, EMPTY_CONSTITUTION, EventType, extractMessageData, GradeReqGetSummary, GradeResSummaryUpdate, GradeSummary, Message, Song, User } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { toMap } from 'src/app/types/utils';

enum GradeState {
	SONGS,
	VOTES,
	RESULTS,
	NO_STATE
}

@Component({
	selector: 'app-grade-owner',
	templateUrl: './grade-owner.component.html',
	styleUrls: ['./grade-owner.component.scss']
})
export class GradeOwnerComponent {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
	summary: GradeSummary = { voteCount: 0, userCount: new Map() };
	cstID = "";
	currentState = GradeState.NO_STATE;

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
			const data = extractMessageData<GradeResSummaryUpdate>(message).summary;
			this.summary = {voteCount: data.voteCount, userCount: toMap(data.userCount)};
			break;
		}
	}

	numberOfVotes(): number {
		return this.constitution.maxUserCount * this.constitution.numberOfSongsPerUser * (this.constitution.maxUserCount - 1);
	}

	votesProgressBarValue(): number {
		return this.summary.voteCount / this.numberOfVotes() * 100;
	}

	getUsers(): User[] {
		return Array.from(this.users.values());
	}

	userNumberOfVotes(user: User): number {
		return this.summary.userCount.get(user.uid) || 0;
	}

	userVotesProgressBarValue(user: User): number {
		const value = this.summary.userCount.get(user.uid) || 0;
		return value / (this.constitution.numberOfSongsPerUser * (this.constitution.maxUserCount - 1)) * 100;
	}

	updateState(newState: GradeState): void {

	}

	isCurrentState(state: GradeState): boolean {
		return this.currentState === state;
	}

	// HTML can't access the GradeState enum directly
	public get gradeState(): typeof GradeState {
		return GradeState;
	}

}
