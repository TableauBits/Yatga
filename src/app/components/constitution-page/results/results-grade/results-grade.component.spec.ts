import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsGradeComponent } from './results-grade.component';

describe('ResultsGradeComponent', () => {
  let component: ResultsGradeComponent;
  let fixture: ComponentFixture<ResultsGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
