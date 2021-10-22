import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Constitution, createMessage, EMPTY_CONSTITUTION, EMPTY_USER, EventType, extractMessageData, GradeReqGetSummary, GradeReqGetUser, GradeResSummaryUpdate, GradeResUserDataUpdate, GradeSummary, GradeUserData, Message, Song, SongPlatform, User } from 'chelys';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY, GRADE_SHOW_STATS_KEY } from 'src/app/types/local-storage';
import { mean, variance } from 'src/app/types/math';
import { compareSongASC, compareSongDSC } from 'src/app/types/song';
import { getEmbedURL, getIDFromURL } from 'src/app/types/url';
import { VoteNavigatorComponent } from './vote-navigator/vote-navigator.component';
import { ActivatedRoute } from '@angular/router';
import { toNumber } from 'lodash';

@Component({
	selector: 'app-votes-grade',
	templateUrl: './votes-grade.component.html',
	styleUrls: ['./votes-grade.component.scss']
})
export class VotesGradeComponent {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION; // TODO : encore besoin ?
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();

  safeUrls: Map<number, SafeResourceUrl> = new Map();
	currentIframeSongID: number;

  votes: GradeUserData;
  summary: GradeSummary;

  cstID = "";

  cardsSortASC: boolean;
  cardsViewEnabled: boolean;
  showStats: boolean;

  constructor(
    private auth: AuthService, 
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) { 
    this.currentIframeSongID = -1;
    this.votes = { uid: this.auth.uid, values: new Map() };
    this.summary = { voteCount: 0 };
    this.cardsSortASC = (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "false";
    this.cardsViewEnabled = (localStorage.getItem(CARDS_VIEW_KEY) ?? true) === "true";
    this.showStats = (localStorage.getItem(GRADE_SHOW_STATS_KEY) ?? true) === "false";
    
    this.auth.waitForAuth(this.handleEvents, this.onConnect, this);
  }

  private onConnect(): void {
    this.route.params.subscribe((params) => {
			this.cstID = params.cstID;
      const messageGetUserVotes = createMessage<GradeReqGetUser>(EventType.CST_SONG_GRADE_get_user, { cstId: this.cstID});
      this.auth.ws.send(messageGetUserVotes);
  
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
      case EventType.CST_SONG_GRADE_userdata_update:
        const entries = Object.entries(extractMessageData<GradeResUserDataUpdate>(message).userData.values);

        entries.forEach((entry) => {
          this.votes.values.set(toNumber(entry[0]), entry[1]);
        })
        break;
    }
  }

  getSongsToVote(): Song[] {
    const songsToVote = Array.from(this.songs.values()).filter(song => song.user !== this.auth.uid);
    if (this.cardsSortASC) return songsToVote.sort(compareSongASC)
		else return songsToVote.sort(compareSongDSC);
  }

  getGrades(): number[] {
    return Array.from(this.votes.values.values());
  }

  getVote(song: Song): number | undefined {
    return this.votes.values.get(song.id);
  }

  getMean(): string {
    const values = Array.from(this.votes.values).map((value) => value[1]);
    const meanValue = mean(values).toFixed(3)
    return meanValue === 'NaN' ? '0.000' : meanValue;
  }

  getVar(): string {
    const values = Array.from(this.votes.values).map((value) => value[1]);
    return variance(mean(values), values).toFixed(3);
  }

  openVoteNavigator(song: Song): void {
    const config = new MatDialogConfig();

    config.data = {
      cstId: this.constitution.id,
			currentSong: song,
      currentVote: this.getVote(song),
			songs: this.getSongsToVote(),
      votes: this.votes
		}

    this.dialog.open(VoteNavigatorComponent, config);
		this.currentIframeSongID = -1;
  }

  userVotesProgressBarValue(): number {
    return this.votes.values.size / (this.constitution.numberOfSongsPerUser * (this.constitution.maxUserCount - 1));
  }

  totalVotesProgressBarValue(): number {
    return this.summary.voteCount / this.numberOfVotes() * 100;
  }

  // TODO : Duplication de code //

  numberOfVotes(): number {
		return this.constitution.maxUserCount * this.constitution.numberOfSongsPerUser * (this.constitution.maxUserCount - 1);
	}

  getUser(uid: string): User {
		return this.users.get(uid) || EMPTY_USER;
	}

  getImageURL(song: Song): string {
		switch (song.platform) {
			case SongPlatform.YOUTUBE: {
				const videoID = getIDFromURL(song);
				return `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
			}
		}
	}

	getSongSafeURL(song: Song): SafeResourceUrl {
		if (!this.safeUrls.has(song.id)) {
			this.safeUrls.set(song.id, getEmbedURL(song, this.sanitizer));
		}
		
		return this.safeUrls.get(song.id) || '';
	}

  updateCurrentIframeSong(song: Song): void {
		this.currentIframeSongID = song.id;
	}

}
