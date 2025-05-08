import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewindTeamComponent } from './rewind-team.component';

describe('RewindTeamComponent', () => {
  let component: RewindTeamComponent;
  let fixture: ComponentFixture<RewindTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewindTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewindTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
