import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  // public profileForm: FormGroup;
  private currentUser: User;

  constructor() {
    this.currentUser = {
      displayName: '',
      photoURL: '',
      uid: '',
      email: '',
      roles: []
    }
  }

  ngOnInit(): void {
  }

}
