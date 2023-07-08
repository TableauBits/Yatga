import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionnalSongInfosButtonComponent } from './optionnal-song-infos-button.component';

describe('OptionnalSongInfosButtonComponent', () => {
  let component: OptionnalSongInfosButtonComponent;
  let fixture: ComponentFixture<OptionnalSongInfosButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionnalSongInfosButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionnalSongInfosButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
