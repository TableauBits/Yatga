import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingGaugeComponent } from './ring-gauge.component';

describe('RingGaugeComponent', () => {
  let component: RingGaugeComponent;
  let fixture: ComponentFixture<RingGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RingGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RingGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
