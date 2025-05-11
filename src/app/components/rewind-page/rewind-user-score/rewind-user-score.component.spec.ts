import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewindUserScoreComponent } from './rewind-user-score.component';

describe('RewindUserScoreComponent', () => {
  let component: RewindUserScoreComponent;
  let fixture: ComponentFixture<RewindUserScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewindUserScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewindUserScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
