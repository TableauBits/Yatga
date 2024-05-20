import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSongComponent } from './remove-song.component';

describe('RemoveSongComponent', () => {
  let component: RemoveSongComponent;
  let fixture: ComponentFixture<RemoveSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveSongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
