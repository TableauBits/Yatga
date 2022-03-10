import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-invites',
  templateUrl: './manage-invites.component.html',
  styleUrls: ['./manage-invites.component.scss']
})
export class ManageInvitesComponent {

  constructor() { 
    console.log(this.test > this.test2);
  }

  test: Date = new Date();
  test2: Date = new Date();
}
