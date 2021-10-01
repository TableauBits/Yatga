import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Constitution, createMessage, CstGradeReqGetSummary, CstGradeReqGetUser, CstGradeResUpdate, EMPTY_CONSTITUTION, EMPTY_USER, EventType, extractMessageData, GradeUserData, Message, Song, SongPlatform, User } from 'chelys';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY, GRADE_SHOW_STATS_KEY } from 'src/app/types/local-storage';
import { mean, variance } from 'src/app/types/math';
import { compareSongASC, compareSongDSC } from 'src/app/types/song';
import { getEmbedURL, getIDFromURL } from 'src/app/types/url';
import { VoteNavigatorComponent } from './vote-navigator/vote-navigator.component';

@Component({
	selector: 'app-votes-grade',
	templateUrl: './votes-grade.component.html',
	styleUrls: ['./votes-grade.component.scss']
})
export class VotesGradeComponent {

	@Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();

  safeUrls: Map<number, SafeResourceUrl> = new Map();
	currentIframeSongID: number;

  votes: GradeUserData;

  cardsSortASC: boolean;
  cardsViewEnabled: boolean;
  showStats: boolean;

  constructor(
    private auth: AuthService, 
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { 
    this.currentIframeSongID = -1;
    this.votes = { uid: '', values: new Map() };
    this.cardsSortASC = (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "false";
    this.cardsViewEnabled = (localStorage.getItem(CARDS_VIEW_KEY) ?? true) === "true";
    this.showStats = (localStorage.getItem(GRADE_SHOW_STATS_KEY) ?? true) === "false";
    
    // TODO : Requête pour chercher les votes
    this.auth.waitForAuth(this.handleEvents, this.onConnect, this);
  }

  private onConnect(): void {
    const messageGetUserVotes = createMessage<CstGradeReqGetUser>(EventType.CST_GRADE_get_user, { cstId: this.constitution.id });
    this.auth.ws.send(messageGetUserVotes);

    const messageGetSummary = createMessage<CstGradeReqGetSummary>(EventType.CST_GRADE_get_summary, { cstId: this.constitution.id });
    this.auth.ws.send(messageGetSummary);
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message = JSON.parse(event.data.toString()) as Message<unknown>;
    
    switch (message.event) {
      case EventType.CST_GRADE_update: {
        // const data = extractMessageData<CstGradeResUpdate>(message).
      }
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
    return 0; // TODO
  }

  // TODO : Duplication de code ? //

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
