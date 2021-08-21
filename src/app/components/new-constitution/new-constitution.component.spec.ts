import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConstitutionComponent } from './new-constitution.component';

describe('NewConstitutionComponent', () => {
  let component: NewConstitutionComponent;
  let fixture: ComponentFixture<NewConstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewConstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewConstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
