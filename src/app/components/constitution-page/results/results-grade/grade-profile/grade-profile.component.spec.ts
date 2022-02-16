import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeProfileComponent } from './grade-profile.component';

describe('GradeProfileComponent', () => {
  let component: GradeProfileComponent;
  let fixture: ComponentFixture<GradeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
