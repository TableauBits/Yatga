import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInvitesComponent } from './manage-invites.component';

describe('ManageInvitesComponent', () => {
  let component: ManageInvitesComponent;
  let fixture: ComponentFixture<ManageInvitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageInvitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageInvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
