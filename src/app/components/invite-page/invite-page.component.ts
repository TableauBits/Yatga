import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invite-page',
  templateUrl: './invite-page.component.html',
  styleUrls: ['./invite-page.component.scss']
})
export class InvitePageComponent {

  public inviteForm: FormGroup;

  constructor(public fb: FormBuilder) {
    this.inviteForm = this.fb.group({
      inviteID: [, Validators.required]
    });
  }

}
