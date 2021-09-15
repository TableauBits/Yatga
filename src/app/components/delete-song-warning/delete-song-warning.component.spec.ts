import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSongWarningComponent } from './delete-song-warning.component';

describe('DeleteSongWarningComponent', () => {
  let component: DeleteSongWarningComponent;
  let fixture: ComponentFixture<DeleteSongWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSongWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSongWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
