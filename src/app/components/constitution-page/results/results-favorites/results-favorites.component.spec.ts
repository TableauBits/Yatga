import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsFavoritesComponent } from './results-favorites.component';

describe('ResultsFavoritesComponent', () => {
  let component: ResultsFavoritesComponent;
  let fixture: ComponentFixture<ResultsFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsFavoritesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
