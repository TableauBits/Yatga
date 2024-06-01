import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleScatterComponent } from './simple-scatter.component';

describe('SimpleScatterComponent', () => {
  let component: SimpleScatterComponent;
  let fixture: ComponentFixture<SimpleScatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleScatterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
