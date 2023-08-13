import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsConstitutionComponent } from './results-constitution.component';

describe('ResultsConstitutionComponent', () => {
  let component: ResultsConstitutionComponent;
  let fixture: ComponentFixture<ResultsConstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsConstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsConstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
