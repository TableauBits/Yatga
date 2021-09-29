import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Constitution, EMPTY_CONSTITUTION, EMPTY_USER, GradeUserData, Song, SongPlatform, User } from '@tableaubits/hang';
import { AuthService } from 'src/app/services/auth.service';
import { CARDS_SORT_KEY, GRADE_SHOW_STATS_KEY } from 'src/app/types/local-storage';
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
  showStats: boolean;

  constructor(
    private auth: AuthService, 
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { 
    this.currentIframeSongID = -1;
    this.votes = { uid: '', values: new Map() };
    this.cardsSortASC = (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "false";
    this.showStats = (localStorage.getItem(GRADE_SHOW_STATS_KEY) ?? true) === "false";
    // TODO : Requête pour chercher les votes
  }

  getSongsToVote(): Song[] {
    // TODO : Sort en fonction du local storage
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
    return mean(values).toFixed(3);
  }

  getVar(): string {
    const values = Array.from(this.votes.values).map((value) => value[1]);
    return variance(mean(values), values).toFixed(3);
  }

  openVoteNavigator(song: Song): void {
    const config = new MatDialogConfig();

    config.data = {
			currentSong: song,
      currentVote: this.getVote(song),
			songs: this.getSongsToVote(),
      votes: this.votes
		}

    this.dialog.open(VoteNavigatorComponent, config);
		this.currentIframeSongID = -1;
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
