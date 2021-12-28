import { Component, Input, OnDestroy } from '@angular/core';
import { Constitution, createMessage, EMPTY_CONSTITUTION, EventType, extractMessageData, GradeReqGetAll, GradeResUserDataUpdate, Message, Song, User } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { generateUserGradeResults, UserGradeResults } from 'src/app/types/results';
import { toMapNumber } from 'src/app/types/utils';

@Component({
  selector: 'app-results-grade',
  templateUrl: './results-grade.component.html',
  styleUrls: ['./results-grade.component.scss']
})
export class ResultsGradeComponent implements OnDestroy {

  @Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();

  results: Map<string, UserGradeResults> = new Map();

  constructor(private auth: AuthService) {
    this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
  }

  ngOnDestroy(): void {
    this.auth.popEventHandler();
		this.auth.popAuthCallback()
  }

  private onConnect(): void {
    // When connected send a request to get all votes
    const messagesGetAllUserVotes = createMessage<GradeReqGetAll>(EventType.CST_SONG_GRADE_get_all, {cstId: this.constitution.id});
    this.auth.ws.send(messagesGetAllUserVotes);
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message = JSON.parse(event.data.toString()) as Message<unknown>;

    // TODO : Other events needed ?
    if (message.event === EventType.CST_SONG_GRADE_userdata_update) {
      const kData = extractMessageData<GradeResUserDataUpdate>(message).userData;
      const data = {uid: kData.uid, values: toMapNumber<number>(kData.values)};

      this.results.set(data.uid, generateUserGradeResults(data));
    }
  }

}
