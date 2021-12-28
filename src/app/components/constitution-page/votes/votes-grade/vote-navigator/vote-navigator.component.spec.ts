import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteNavigatorComponent } from './vote-navigator.component';

describe('VoteNavigatorComponent', () => {
  let component: VoteNavigatorComponent;
  let fixture: ComponentFixture<VoteNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoteNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
