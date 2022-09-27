import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

export interface Release {
	body: string;
	html_url: string;
	name: string;
	published_at: string;
	tag_name: string;
}

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

	releases: Release[];

	constructor(private http: HttpClient) {
		this.releases = [];
		this.get() 
	}

	get(): void {
		this.http.get('https://api.github.com/repos/TableauBits/Yatga/releases').subscribe((data: any) => {
			this.releases = data;
			console.log(this.releases)
		});
	}
}
