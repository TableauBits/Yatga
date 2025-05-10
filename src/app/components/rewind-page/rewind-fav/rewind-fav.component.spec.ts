import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewindFavComponent } from './rewind-fav.component';

describe('RewindFavComponent', () => {
  let component: RewindFavComponent;
  let fixture: ComponentFixture<RewindFavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewindFavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewindFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
