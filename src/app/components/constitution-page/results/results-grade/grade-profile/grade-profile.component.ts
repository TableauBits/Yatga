import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EMPTY_USER_GRADE_RESULTS, UserGradeResults } from 'src/app/types/results';

@Component({
  selector: 'app-grade-profile',
  templateUrl: './grade-profile.component.html',
  styleUrls: ['./grade-profile.component.scss']
})
export class GradeProfileComponent implements OnChanges {

  @Input() result: UserGradeResults = EMPTY_USER_GRADE_RESULTS;

  histogramValues: number[] = []

  ngOnChanges(changes: SimpleChanges): void {
    this.histogramValues = Array.from(changes['result'].currentValue.data.values.values());
  }

  constructor() { }

}
