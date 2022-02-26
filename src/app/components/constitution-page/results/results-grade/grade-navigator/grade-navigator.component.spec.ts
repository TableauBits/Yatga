import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeNavigatorComponent } from './grade-navigator.component';

describe('GradeNavigatorComponent', () => {
  let component: GradeNavigatorComponent;
  let fixture: ComponentFixture<GradeNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
