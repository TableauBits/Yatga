import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeGradesComponent } from './grade-grades.component';

describe('GradeGradesComponent', () => {
  let component: GradeGradesComponent;
  let fixture: ComponentFixture<GradeGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeGradesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
