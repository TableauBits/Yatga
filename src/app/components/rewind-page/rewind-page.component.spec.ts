import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewindPageComponent } from './rewind-page.component';

describe('RewindPageComponent', () => {
  let component: RewindPageComponent;
  let fixture: ComponentFixture<RewindPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewindPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewindPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
