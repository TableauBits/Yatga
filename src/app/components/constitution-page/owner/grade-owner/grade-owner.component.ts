import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constitution, createMessage, CstReqState, CstResUpdate, EMPTY_CONSTITUTION, EventType, extractMessageData, GradeReqGetSummary, GradeResSummaryUpdate, GradeSummary, Message, Song, User } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { toMap } from 'src/app/types/utils';

enum GradeState {
	SONGS,
	VOTES,
	RESULTS,
	NO_STATE
}

const STATES: Map<GradeState, string> = new Map([
	[GradeState.SONGS, "Période d'ajout et modification de chansons"],
	[GradeState.VOTES, "Période de votes"],
	[GradeState.RESULTS, "Période de résultats"],
	[GradeState.NO_STATE, "ERROR"]
]);

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
    
		console.log(message);

    switch (message.event) { 
			case EventType.CST_SONG_GRADE_summary_update:
				const data = extractMessageData<GradeResSummaryUpdate>(message).summary;
				this.summary = {voteCount: data.voteCount, userCount: toMap(data.userCount)};
				break;

			case EventType.CST_update:
				const cst = extractMessageData<CstResUpdate>(message).cstInfo;
				if (cst.id !== this.constitution.id) return;
				this.constitution = cst;
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
		return this.summary.userCount.get(user.uid) || 0;
	}

	userVotesProgressBarValue(user: User): number {
		const value = this.summary.userCount.get(user.uid) || 0;
		return value / (this.constitution.numberOfSongsPerUser * (this.constitution.maxUserCount - 1)) * 100;
	}

	canGoNextState(): boolean {
		switch (this.constitution.state) {
			case GradeState.SONGS:
				return true;	// Go to VOTES only if we have all songs
		
			case GradeState.VOTES:	// Go to RESULTS only if we have all votes
				return true;
		}
		return false;
	}

	canGoPreviousState(): boolean {
		// No condition to go to a previous state
		switch (this.constitution.state) {
			case GradeState.VOTES:
				return true;
			case GradeState.RESULTS:
				return true;
		}
		return false;
	}

	updateState(shift: number): void {
		// this.constitution.state += shift;
		const message = createMessage<CstReqState>(EventType.CST_state, {id: this.constitution.id, state: this.constitution.state + shift});
		this.auth.ws.send(message);
		window.location.reload();		// TODO : find a best option
	}

	returnText(): string {
		return STATES.get(this.constitution.state) || "ERROR";
	}

	// HTML can't access the GradeState enum directly
	public get gradeState(): typeof GradeState {
		return GradeState;
	}

}
