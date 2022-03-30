import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeRelationshipComponent } from './grade-relationship.component';

describe('GradeRelationshipComponent', () => {
  let component: GradeRelationshipComponent;
  let fixture: ComponentFixture<GradeRelationshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeRelationshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
