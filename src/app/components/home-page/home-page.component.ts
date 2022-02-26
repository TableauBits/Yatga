import { Component } from '@angular/core';

const THEMES = ['saxo', 'specialist', 'sonic', '90s']

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent  {

	theme: string;

	constructor() {
		this.theme = `assets/${THEMES[Math.floor(Math.random() * THEMES.length)]}`;
	}

}
