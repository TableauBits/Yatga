import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantheonPageComponent } from './pantheon-page.component';

describe('PantheonPageComponent', () => {
  let component: PantheonPageComponent;
  let fixture: ComponentFixture<PantheonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PantheonPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PantheonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
