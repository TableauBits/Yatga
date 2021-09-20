import { Component } from '@angular/core';
import { CARDS_SORT_KEY, CARDS_VIEW_KEY } from 'src/app/types/local-storage';

interface LocalSettings {
	cardsView: boolean;
  cardsSortDSC: boolean;
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
      cardsSortDSC: (localStorage.getItem(CARDS_SORT_KEY) ?? true) === "true"
    };
  }

  updateCardsView(): void {
		this.localSettings.cardsView = !this.localSettings.cardsView;
		localStorage.setItem(CARDS_VIEW_KEY, this.localSettings.cardsView.toString());
	}

  updateCardsSort(): void {
		this.localSettings.cardsSortDSC = !this.localSettings.cardsSortDSC;
		localStorage.setItem(CARDS_SORT_KEY, this.localSettings.cardsSortDSC.toString());
	}

}
