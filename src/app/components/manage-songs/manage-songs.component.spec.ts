import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSongsComponent } from './manage-songs.component';

describe('ManageSongsComponent', () => {
  let component: ManageSongsComponent;
  let fixture: ComponentFixture<ManageSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSongsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
