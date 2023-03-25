import { Component } from '@angular/core';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY, GRADE_ALREADY_VOTES_KEY, GRADE_SHOW_STATS_KEY } from 'src/app/types/local-storage';


const Views = ["card", "list", "card-new"]
type CardsView = typeof Views[number];
function isCardsView(x: any): x is CardsView {
  return Views.includes(x);
}
interface LocalSettings {
  cardsView: CardsView;
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
    if (!isCardsView(localStorage.getItem(CARDS_VIEW_KEY))) {
      localStorage.setItem(CARDS_VIEW_KEY, "card");
    }
    this.localSettings = {
      cardsView: localStorage.getItem(CARDS_VIEW_KEY) as CardsView,
      cardsSortDSC: (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "true",
      gradeShowAlreadyVoted: (localStorage.getItem(GRADE_ALREADY_VOTES_KEY) ?? true) === "true",
      gradeShowStats: (localStorage.getItem(GRADE_SHOW_STATS_KEY) ?? true) === "true"
    };
  }

  // TODO : Map & Service ?
  updateCardsView(): void {
    localStorage.setItem(CARDS_VIEW_KEY, this.localSettings.cardsView.toString());
    console.log(localStorage.getItem(CARDS_VIEW_KEY));
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
