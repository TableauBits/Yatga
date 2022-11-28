import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { isNil } from 'lodash';

interface Changes {
	author: string;
	title: string;
	url: string;
}

interface BodyRelease {
	body: string;
	changes: Changes[];
	full: string;
}

interface MatbayRelease {
	body: BodyRelease;
	date: string;
	name: string;
	url: string;
	tag: string;
}

interface GithubRelease {
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
	releases: MatbayRelease[];

	constructor(private http: HttpClient) {
		this.releases = [];
		this.get();
	}

	get(): void {
		this.http.get('https://api.github.com/repos/TableauBits/Yatga/releases').subscribe((data: any) => {
			this.releases = (data as GithubRelease[]).map(d => {
				return {
					body: this.cleanBody(d.body),
					date: d.published_at.slice(0, 10),
					name: d.name,
					url: d.html_url,
					tag: d.tag_name,
				};
			});
		});
	}

	cleanBody(body: string): BodyRelease {
		let full = "";
		let changes: Changes[] = [];
		for(let sentence of body.split('\n')) {
			if (sentence.includes("**Full Changelog**:")) {
				const index = sentence.indexOf('https://github.com/TableauBits/Yatga');
				full = sentence.substring(index);
			} else if (sentence.startsWith("* ")) {
				const reg = new RegExp(/\* (.*) by @(.*) in (.*)/gm);
				const result = reg.exec(sentence);
				if (isNil(result)) continue;
				changes.push({
					author: result[2],
					title: result[1],
					url: result[3],
				});
			}
		}
		return {
			body,
			changes,
			full,
		};
	}
}
