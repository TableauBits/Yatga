import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constitution, createMessage, EMPTY_CONSTITUTION, EventType, extractMessageData, GradeReqGetAll, GradeReqUnsubscribe, GradeResUserDataUpdate, GuessReqGetAll, GuessResUserDataUpdate, GuessUserData, Message, Song, User, UserFavorites } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { EMPTY_USER_GRADE_RESULTS, generateUserGradeResults, SongGradeResult, UserGradeResults } from 'src/app/types/results';
import { toMapNumber } from 'src/app/types/utils';

enum GradeResultSection {
  RANKING,
  GRADES,
  AVERAGE,
  RANKS,
  FAVORITES,
  PROFIL,
  ELECTORAL,
  GUESS,
  RELATIONSHIP,
  CONSTITUTION
}

function compareScore(s1: SongGradeResult, s2: SongGradeResult): number {
	if (s1.score > s2.score) return -1;
	if (s1.score < s2.score) return 1;
	return 0;
}

@Component({
  selector: 'app-results-grade',
  templateUrl: './results-grade.component.html',
  styleUrls: ['./results-grade.component.scss']
})
export class ResultsGradeComponent implements OnDestroy {

  @Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();
  @Input() favorites: Map<string, UserFavorites> = new Map();

  userResults: Map<string, UserGradeResults> = new Map();
  userGuesses: Map<string, GuessUserData> = new Map();
  songResults: SongGradeResult[] = [];

  currentSection: GradeResultSection = GradeResultSection.RANKING;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
  }

  ngOnDestroy(): void {
    this.auth.ws.send(createMessage<GradeReqUnsubscribe>(EventType.CST_SONG_GRADE_unsubscribe, {cstId: this.constitution.id}));

    this.auth.popEventHandler();
		this.auth.popAuthCallback();
  }

  private onConnect(): void {
    // When connected send a request to get all votes
    this.route.params.subscribe((params) => {
      const cstID = params.cstID;
      const messageGetAllVotes = createMessage<GradeReqGetAll>(EventType.CST_SONG_GRADE_get_all, {cstId: cstID});
      this.auth.ws.send(messageGetAllVotes);

      const messageGetAllGuesses = createMessage<GuessReqGetAll>(EventType.CST_SONG_GUESS_get_all, {cstId: cstID});
      this.auth.ws.send(messageGetAllGuesses);
    });
  }

  private handleEvents(event: MessageEvent<any>): void {
    const message = JSON.parse(event.data.toString()) as Message<unknown>;

    if (message.event === EventType.CST_SONG_GRADE_userdata_update) {
      const kData = extractMessageData<GradeResUserDataUpdate>(message).userData;
      const data = {uid: kData.uid, values: toMapNumber<number>(kData.values)};

      console.log(data);

      this.userResults.set(data.uid, generateUserGradeResults(data));
    }

    if (message.event === EventType.CST_SONG_GUESS_update) {
      const kData = extractMessageData<GuessResUserDataUpdate>(message).userData;
      const data = {uid: kData.uid, values: toMapNumber<string>(kData.values)};
      this.userGuesses.set(data.uid, {guesses: data.values, uid: data.uid});
    }   
    

    if (this.constitution.maxUserCount === this.userResults.size) {
      this.generateSongResults();
    }
  }

  // HTML can't access the ConstiutionSection enum directly
	public get gradeResultSection(): typeof GradeResultSection {
		return GradeResultSection;
	}

  setCurrentSection(newSection: GradeResultSection): void {
		this.currentSection = newSection;
	}

	isSectionActive(section: GradeResultSection): boolean {
		return section === this.currentSection;
	}

  getAuthResult(): UserGradeResults {
    return this.userResults.get(this.auth.uid) || EMPTY_USER_GRADE_RESULTS;
  }

  generateSongResults(): void {
    this.songResults = [];
    for (const song of this.songs.values()) {
      let score = 0;
      for (const vote of this.userResults.values()) {
        score += vote.normalizeScores.get(song.id) || 0;
      }
      this.songResults.push({
        id: song.id,
        score
      });
    }

    this.songResults.sort(compareScore);
  }

  isInConstitution(): boolean {
		return this.constitution.users.includes(this.auth.uid);
	}

  hasAnyGuess(): boolean {
    return Array.from(this.userGuesses.values()).some((userData) => userData.guesses.size > 0);
  }
}
