import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotesGradeComponent } from './votes-grade.component';

describe('VotesGradeComponent', () => {
  let component: VotesGradeComponent;
  let fixture: ComponentFixture<VotesGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotesGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotesGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
