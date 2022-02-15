import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeElectoralComponent } from './grade-electoral.component';

describe('GradeElectoralComponent', () => {
  let component: GradeElectoralComponent;
  let fixture: ComponentFixture<GradeElectoralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeElectoralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeElectoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
