import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinConstitutionComponent } from './join-constitution.component';

describe('JoinConstitutionComponent', () => {
  let component: JoinConstitutionComponent;
  let fixture: ComponentFixture<JoinConstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinConstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinConstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
