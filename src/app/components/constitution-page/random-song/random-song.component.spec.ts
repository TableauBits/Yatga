import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomSongComponent } from './random-song.component';

describe('RandomSongComponent', () => {
  let component: RandomSongComponent;
  let fixture: ComponentFixture<RandomSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomSongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
