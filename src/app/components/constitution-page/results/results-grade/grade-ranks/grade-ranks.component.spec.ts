import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeRanksComponent } from './grade-ranks.component';

describe('GradeRanksComponent', () => {
  let component: GradeRanksComponent;
  let fixture: ComponentFixture<GradeRanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeRanksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeRanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
