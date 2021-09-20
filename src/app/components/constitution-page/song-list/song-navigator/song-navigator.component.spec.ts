import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongNavigatorComponent } from './song-navigator.component';

describe('SongNavigatorComponent', () => {
  let component: SongNavigatorComponent;
  let fixture: ComponentFixture<SongNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
