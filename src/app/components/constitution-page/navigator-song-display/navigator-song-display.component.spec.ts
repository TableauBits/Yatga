import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatorSongDisplayComponent } from './navigator-song-display.component';

describe('NavigatorSongDisplayComponent', () => {
  let component: NavigatorSongDisplayComponent;
  let fixture: ComponentFixture<NavigatorSongDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigatorSongDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigatorSongDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
