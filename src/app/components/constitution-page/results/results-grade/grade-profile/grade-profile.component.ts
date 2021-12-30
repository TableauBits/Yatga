import { Component, Input } from '@angular/core';
import { EMPTY_USER_GRADE_RESULTS, UserGradeResults } from 'src/app/types/results';

@Component({
  selector: 'app-grade-profile',
  templateUrl: './grade-profile.component.html',
  styleUrls: ['./grade-profile.component.scss']
})
export class GradeProfileComponent {

  @Input() result: UserGradeResults = EMPTY_USER_GRADE_RESULTS;

  constructor() { }

}
