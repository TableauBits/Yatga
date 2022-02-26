import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeRankingComponent } from './grade-ranking.component';

describe('GradeRankingComponent', () => {
  let component: GradeRankingComponent;
  let fixture: ComponentFixture<GradeRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
