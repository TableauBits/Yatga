import { Component, Input } from '@angular/core';
import { Constitution, EMPTY_CONSTITUTION, Song, User } from 'chelys';

@Component({
  selector: 'app-results-grade',
  templateUrl: './results-grade.component.html',
  styleUrls: ['./results-grade.component.scss']
})
export class ResultsGradeComponent {

  @Input() constitution: Constitution = EMPTY_CONSTITUTION;
	@Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();

  constructor() { }

}
