import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvHistogramComponent } from './inv-histogram.component';

describe('InvHistogramComponent', () => {
  let component: InvHistogramComponent;
  let fixture: ComponentFixture<InvHistogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvHistogramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
