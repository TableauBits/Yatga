import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstitutionComponent } from './constitution.component';

describe('ConstitutionComponent', () => {
  let component: ConstitutionComponent;
  let fixture: ComponentFixture<ConstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
