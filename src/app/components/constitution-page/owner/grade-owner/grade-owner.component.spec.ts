import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeOwnerComponent } from './grade-owner.component';

describe('GradeOwnerComponent', () => {
  let component: GradeOwnerComponent;
  let fixture: ComponentFixture<GradeOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
