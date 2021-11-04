import { Component } from '@angular/core';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY, GRADE_ALREADY_VOTES_KEY, GRADE_SHOW_STATS_KEY } from 'src/app/types/local-storage';

interface LocalSettings {
	cardsView: boolean;
  cardsSortDSC: boolean;
  gradeShowAlreadyVoted: boolean;
  gradeShowStats: boolean;
}

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent {

  public localSettings: LocalSettings;

  constructor() {
    this.localSettings = { 
      cardsView: (localStorage.getItem(CARDS_VIEW_KEY) ?? true) === "true",
      cardsSortDSC: (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "true",
      gradeShowAlreadyVoted: (localStorage.getItem(GRADE_ALREADY_VOTES_KEY) ?? true) === "true",
      gradeShowStats: (localStorage.getItem(GRADE_SHOW_STATS_KEY) ?? true) === "true"
    };
  }

  // TODO : Map & Service ?
  updateCardsView(): void {
		this.localSettings.cardsView = !this.localSettings.cardsView;
		localStorage.setItem(CARDS_VIEW_KEY, this.localSettings.cardsView.toString());
	}

  updateCardsSort(): void {
		this.localSettings.cardsSortDSC = !this.localSettings.cardsSortDSC;
		localStorage.setItem(CARDS_SORT_KEY, this.localSettings.cardsSortDSC.toString());
	}

  updateGradeAlreadyVoted(): void {
		this.localSettings.gradeShowAlreadyVoted = !this.localSettings.gradeShowAlreadyVoted;
		localStorage.setItem(GRADE_ALREADY_VOTES_KEY, this.localSettings.gradeShowAlreadyVoted.toString());
	}

  updateGradeShowStats(): void {
		this.localSettings.gradeShowStats = !this.localSettings.gradeShowStats;
		localStorage.setItem(GRADE_SHOW_STATS_KEY, this.localSettings.gradeShowStats.toString());
	}

}
